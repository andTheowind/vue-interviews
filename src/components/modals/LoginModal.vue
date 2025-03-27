<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { submitLogin } from '@/composable/api';
import ModalWrapper from './ModalWrapper.vue';
import BaseField from './fields/BaseField.vue';
import BottomField from './fields/BottomField.vue';

// роутер для навигации
const router = useRouter();

// состояние модального окна
const isOpen = ref(false);

const email = ref('');
const password = ref('');
const loginSuccess = ref('');
const errorList = ref<string[]>([]);

const emit = defineEmits(['set-actions', 'open-register']);

// функции открытия/закрытия модального окна
const openModal = () => { isOpen.value = true; };
const closeModal = () => { isOpen.value = false; };

// функция для отправки формы входа
const handleSubmitLogin = async () => {
    await submitLogin(errorList.value, email.value, password.value, loginSuccess, router);
};

onMounted(() => {
    emit('set-actions', { open: openModal, close: closeModal });
});
</script>

<template>
    <ModalWrapper :isOpen="isOpen" @close="closeModal">
        <template v-if="loginSuccess">
            <div class="modal__success-window">
                <p class="modal__success-text">{{ loginSuccess }}</p>
                <button class="modal__button" @click="closeModal">Ок</button>
            </div>
        </template>
        <template v-else>
            <h2 class="modal__title">Вход в ваш аккаунт</h2>
            <form @submit.prevent="handleSubmitLogin" class="modal__form">
                <BaseField label="Email" name="Email" type="email" v-model:modelValue="email"
                    placeholder="Введите Email" required />
                <BaseField label="Пароль" name="password" type="password" v-model:modelValue="password" required />
                <BottomField action="Войти" :errorList="errorList">
                    У вас нет аккаунта?
                    <a href="#" class="modal__signup-link" @click.prevent="$emit('open-register')">
                        Зарегистрируйтесь
                    </a>
                </BottomField>
            </form>
        </template>
    </ModalWrapper>
</template>

<style scoped src="@/assets/css/login-modal.css"></style>