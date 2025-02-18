<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { useRouter } from 'vue-router'; 
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/assets/utils/constants/environments';
import ModalWrapper from './ModalWrapper.vue';

// роутер для навигации
const router = useRouter();

// состояние модального окна
const isOpen = ref(false);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loginSuccess = ref('');
const errorList = ref<string[]>([]);

const emit = defineEmits(['set-actions', 'open-register']);

// функции открытия/закрытия модального окна
const openModal = () => { isOpen.value = true; };
const closeModal = () => { isOpen.value = false; };

// функция для отправки формы входа
const submitLogin = async () => {
    errorList.value = [];
    loginSuccess.value = '';
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        if (!response.ok) {
            const data = await response.json();
            errorList.value = Array.isArray(data.message) ? data.message : [data.message];
        } else {
            const data = await response.json();
            Cookies.set('accessToken', data.accessToken, { path: '/' });
            loginSuccess.value = "Вы успешно вошли в систему";
            router.push('/notes');
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
        <template v-if="loginSuccess">
            <div class="modal__success-window">
                <p>{{ loginSuccess }}</p>
                <button class="modal__button" @click="closeModal">ОК</button>
            </div>
        </template>
        <template v-else>
            <h2 class="modal__title">Вход в ваш аккаунт</h2>
            <form @submit.prevent="submitLogin" class="modal__form">
                <div class="modal__form-group">
                    <label for="email" class="modal__label">Email</label>
                    <input 
                        id="email" type="email" 
                        v-model="email" 
                        class="modal__input" 
                        placeholder="Введите Email" required 
                    />
                </div>
                <div class="modal__form-group">
                    <label for="password" class="modal__label">Пароль</label>
                    <div class="modal__password-wrapper">
                        <input 
                            id="password" :type="showPassword ? 'text' : 'password'" 
                            v-model="password" 
                            class="modal__input" 
                            placeholder="Введите пароль" required 
                        />
                    </div>
                </div>
                <div class="modal__footer">
                    <div class="modal__footer-row">
                        <p class="modal__signup">
                            У вас нет аккаунта?
                            <a href="#" class="modal__signup-link" @click.prevent="$emit('open-register')">
                                Зарегистрируйтесь
                            </a>
                        </p>
                        <button type="submit" class="modal__button">Войти</button>
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
@import url('@/assets/css/login-modal.css');
</style>
