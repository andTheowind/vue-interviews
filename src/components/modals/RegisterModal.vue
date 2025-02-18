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
@import url('@/assets/css/register-modal.css');
</style>
