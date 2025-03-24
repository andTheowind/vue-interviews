<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { submitRegister } from '@/composable/api';
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

// для открытия/закрытия модального окна
const openModal = () => { isOpen.value = true; };
const closeModal = () => { isOpen.value = false; };

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
            <form
                @submit.prevent="() => submitRegister(errorList, email, password, confirmPassword, { value: registerSuccess }, closeModal)"
                class="modal__form">
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
