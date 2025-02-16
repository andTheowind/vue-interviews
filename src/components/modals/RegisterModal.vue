<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { BACKEND_URL } from '@/assets/utils/constants/environments';
import ModalWrapper from './ModalWrapper.vue';

// состояние модального окна
const isOpen = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const registerSuccess = ref('');
const errorList = ref<string[]>([]);

const emit = defineEmits(['set-actions', 'open-login']);

// функции открытия/закрытия модального окна
const openModal = () => { isOpen.value = true; };
const closeModal = () => { isOpen.value = false; };

// функция для отправки формы регистрации
const submitRegister = async () => {
    errorList.value = [];
    registerSuccess.value = '';
    try {
        const response = await fetch(`${BACKEND_URL}/api/reg`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                confirm_password: confirmPassword.value
            })
        });

        if (!response.ok) {
            const data = await response.json();
            errorList.value = Array.isArray(data.message) ? data.message : [data.message];
        } else {
            registerSuccess.value = "Регистрация прошла успешно!";
        }
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
};

onMounted(() => {
    emit('set-actions', { open: openModal, close: closeModal });
});
</script>

<template>
    <ModalWrapper :isOpen="isOpen" @close="closeModal">
        <template v-if="registerSuccess">
            <div class="modal__success-window">
                <p>{{ registerSuccess }}</p>
                <button class="modal__button" @click="closeModal">ОК</button>
            </div>
        </template>

        <template v-else>
            <h2 class="modal__title">Регистрация</h2>
            <form @submit.prevent="submitRegister" class="modal__form">
                <div class="modal__form-group">
                    <label for="email" class="modal__label">Email</label>
                    <input 
                        id="email" 
                        type="email" v-model="email" 
                        class="modal__input" 
                        placeholder="Введите Email" required 
                    />
                </div>
                <div class="modal__form-group">
                    <label for="password" class="modal__label">Пароль</label>
                    <input 
                        id="password" 
                        :type="showPassword ? 'text' : 'password'" 
                        v-model="password" 
                        class="modal__input" 
                        placeholder="Введите пароль" required
                    />
                </div>
                <div class="modal__form-group">
                    <label for="confirm-password" class="modal__label">Подтвердите пароль</label>
                    <input 
                        id="confirm-password" :type="showPassword ? 'text' : 'password'" 
                        v-model="confirmPassword" 
                        class="modal__input" 
                        placeholder="Подтвердите пароль" required
                    />
                </div>
                <div class="modal__footer">
                    <div class="modal__footer-row">
                        <p class="modal__signup">
                            Уже есть аккаунт?
                            <a href="#" class="modal__signup-link" @click.prevent="$emit('open-login')">
                                Войдите
                            </a>
                        </p>
                        <button type="submit" class="modal__button">Зарегистрироваться</button>
                    </div>
                    <div class="modal__footer-row">
                        <div v-if="errorList.length" class="modal__errors">
                            <ul>
                                <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </template>
    </ModalWrapper>
</template>

<style scoped>
.modal__title {
    font-size: 32px;
    margin-bottom: 20px;
    font-weight: bold;
}
.modal__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.modal__label {
    display: block;
    margin-left: 24px;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 400;
    color: #9DA5AF; 
}
.modal__input {
    width: 100%;
    padding: 14px 14px 14px 28px;
    border-radius: 28px;
    border: none;
    font-size: 16px;
    background: #fff;
    color: #000;
}
.modal__signup {
    color: #9DA5AF;
}
.modal__signup-link {
    color: #a6ce39;
    text-decoration: none;
    font-weight: bold;
}
.modal__button {
    display: inline-block;
    background-color: #a6ce39;
    padding: 17px 24px;
    border: none;
    border-radius: 34px;
    font-size: 19px;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 1px;
    color: #fff;
    width: 100%;
    max-width: fit-content;
    transition: background-color 0.35s;
    text-align: center;
}
.modal__button:hover {
    background: #8fbf33;
}
.modal__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    text-align: center;
    padding-top: 20px;
    width: 100%;
}
.modal__footer-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
}
.modal__errors {
    align-self: flex-start;
}
.modal__errors ul {
    margin-top: 8px;
    padding: 8px 14px 8px 14px;
    font-size: 14px;
    color: #FF7461;
    background-color: rgba(255, 116, 97, 10%);
    border-radius: 24px;
}
.modal__errors ul li {
    list-style-type: none;
}

@media (min-width: 768px) {
    .modal__footer,
    .modal__footer-row {
        display: flex;
    }

    .modal__footer-row {
        width: 100%;
        flex-direction: row;
        align-self: center;
        justify-content: space-between;
    }
}

@media (min-width: 1200px) {
    .modal__title {
        font-size: 52px;
    }

    .modal__input {
        min-width: 380px;
    }
}

@media (min-width: 1440px) {
    .modal__input {
        min-width: 620px;
        padding: 27px 14px 27px 28px;
        border-radius: 36px;
    }
}
</style>
