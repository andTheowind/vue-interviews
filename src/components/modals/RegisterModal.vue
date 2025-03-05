<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { BACKEND_URL } from '@/assets/utils/constants/environments';
import ModalWrapper from './ModalWrapper.vue';
import BaseField from './fields/BaseField.vue';
import BottomField from './fields/BottomField.vue';

const isOpen = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showConfirmPassword = ref(false);
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
                <p class="modal__success-text">{{ registerSuccess }}</p>
                <a class="modal__button" @click="closeModal">Ок</a>
            </div>
        </template>
        <template v-else>
            <h2 class="modal__title">Регистрация</h2>
            <form @submit.prevent="submitRegister" class="modal__form">
                <BaseField label="Email" name="email" type="email" v-model:modelValue="email"
                    placeholder="Введите email" required />
                <BaseField label="Пароль" name="password" type="password" v-model:modelValue="password" required />
                <div class="modal__form-group">
                    <label for="confirm-password" class="modal__label">Подтвердите пароль</label>
                    <div class="modal__input-wrapper">
                        <input id="confirm-password" :type="showConfirmPassword ? 'text' : 'password'"
                            v-model="confirmPassword" class="modal__input" placeholder="Подтвердите пароль" required />
                        <span @click="showConfirmPassword = !showConfirmPassword" class="modal__button-visibillity">
                            <img src="@/assets/img/visibillity-icon.svg" alt="">
                        </span>
                    </div>
                </div>
                <BottomField action="Зарегистрироваться" :errorList="errorList">
                    Уже есть аккаунт?
                    <a href="#" class="modal__signup-link" @click.prevent="$emit('open-login')">
                        Войдите
                    </a>
                </BottomField>
            </form>
        </template>
    </ModalWrapper>
</template>

<style scoped src="@/assets/css/register-modal.css"></style>
<style scoped src="@/assets/css/base-field.css"></style>
