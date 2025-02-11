<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { BACKEND_URL } from '@/assets/utils/constants/environments';

// Управляет состоянием модального окна (открыто/закрыто)
const isOpen = ref(false); 

// Переменные для хранения данных формы
const email = ref('');
const password = ref('');
const confirmPassword = ref(''); 

// Показывать или скрывать пароль
const showPassword = ref(false);

// Список ошибок при регистрации
const errorList = ref<string[]>([]); 

// Сообщение об успешной регистрации
const registerSuccess = ref(''); 

// Определяем события, которые можно вызывать из компонента
const emit = defineEmits(['set-actions', 'open-register', 'open-login']);

// Функция для открытия модального окна
const openModal = () => {
    isOpen.value = true;
};

// Функция для закрытия модального окна
const closeModal = () => {
    isOpen.value = false;
};

// Функция для отправки данных регистрации на сервер
const submitRegister = async () => {
    // Очищаем предыдущие ошибки
    errorList.value = []; 

    // Очищаем предыдущее сообщение об успехе
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
            // Убеждаемся, что errorList всегда является массивом
            errorList.value = Array.isArray(data.message) ? data.message : [data.message];
        } else {
            registerSuccess.value = "Вы успешно прошли регистрацию";
        }
    } catch (error) {
        console.error('Ошибка запроса: ', error);
    }
};

// Выполняется при монтировании компонента
onMounted(() => {
    // Отправляем в родительский компонент функции открытия и закрытия модального окна
    emit('set-actions', { open: openModal, close: closeModal });
});
</script>


<template>
    <div class="modal" v-if="isOpen">
        <div class="modal__overlay" @click="closeModal"></div>
        <div class="modal__content">
            <button class="modal__close" @click="closeModal">
                <img src="@/assets/img/close-btn.svg" alt="">
            </button>
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
                        <input id="email" type="email" v-model="email" class="modal__input" placeholder="Введите Email" required />
                    </div>
                    <div class="modal__form-group">
                        <label for="password" class="modal__label">Пароль</label>
                        <div class="modal__password-wrapper">
                            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" class="modal__input" placeholder="Введите пароль" required />
                        </div>
                    </div>
                    <div class="modal__form-group">
                        <label for="confirm-password" class="modal__label">Подтвердите пароль</label>
                        <div class="modal__password-wrapper">
                            <input id="confirm-password" :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" class="modal__input" placeholder="Подтвердите пароль" required />
                        </div>
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
                        <div v-if="errorList.length" class="modal__errors">
                            <ul>
                                <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </template>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
}

.modal__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
}

.modal__content {
    background: #1a2b44;
    padding: 60px;
    border-radius: 40px;
    max-width: 500px;
    color: #fff;
    position: relative;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.modal__close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #a6ce39;
    border: none;
    font-size: 18px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal__title {
    font-size: 32px;
    margin-bottom: 20px;
    font-weight: bold;
}

.modal__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

.modal__form-group .modal__label {
    display: block;
    margin-bottom: 8px;
    margin-left: 24px;
    font-weight: 400;
    color: #9DA5AF; 
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

.modal__footer-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
}

.modal__button {
    display: inline-flex;
    justify-content: center;
    background-color: #a6ce39;
    padding: 17px 12px;
    border: none;
    border-radius: 34px;
    font-size: 19px;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 1px;
    color: #fff;
    width: 100%;
    max-width: 264px;
    transition: background-color 0.35s;
    text-align: center;
}

.modal__button:hover {
    background: #8fbf33;
}

.modal__signup {
    font-size: 16px;
    color: #9DA5AF;
}

.modal__signup-link {
    color: #a6ce39;
    font-weight: 700;
    text-decoration: none;
}

.modal__input {
    padding: 14px 14px 14px 28px;
    border-radius: 28px;
    font-size: 16px;
    background: #fff;
    color: #9DA5AF;
    width: 100%;
    font-family: "Montserrat", serif;
}

.modal__input::placeholder {
    cfont-family: "Montserrat", serif;
}

.modal__input:focus {
    outline: 1px solid #a6ce39;
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
    .modal__content {
        max-width: 780px;
        padding: 74px 80px 74px 80px;
    }

    .modal__input {
        min-width: 620px;
    }

    .modal__input {
        padding: 27px 14px 27px 28px;
        border-radius: 36px;
    }
}
</style>
