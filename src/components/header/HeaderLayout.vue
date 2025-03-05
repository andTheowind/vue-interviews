<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import { logout } from '@/services/logout';
import HeaderLogo from '@/components/header/components/HeaderLogo.vue';
import HeaderLogin from '@/components/header/components/HeaderLogin.vue';
import HeaderLogout from '@/components/header/components/HeaderLogout.vue';
import LoginModal from '@/components/modals/LoginModal.vue';
import RegisterModal from '@/components/modals/RegisterModal.vue';
import { BACKEND_URL } from '@/assets/utils/constants/environments';

const loginModalActions = ref<{ open?: () => void; close?: () => void }>({});
const registerModalActions = ref<{ open?: () => void; close?: () => void }>({});

const userData = ref<{ id: number; email: string } | null>(null);

const handleLoginSetActions = (actions: { open?: () => void; close?: () => void }) => {
    loginModalActions.value = actions;
};

const handleRegisterSetActions = (actions: { open?: () => void; close?: () => void }) => {
    registerModalActions.value = actions;
};

const openRegisterModal = () => {
    if (loginModalActions.value.close) loginModalActions.value.close();
    if (registerModalActions.value.open) registerModalActions.value.open();
};

const openLoginModal = () => {
    if (registerModalActions.value.close) registerModalActions.value.close();
    if (loginModalActions.value.open) loginModalActions.value.open();
};

onMounted(async () => {
    const token = Cookies.get('accessToken');
    if (token) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                userData.value = await response.json();
            } else {
                console.error('Failed to load user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
});

const onLogout = () => {
    Cookies.remove('accessToken');
    userData.value = null;
    logout()
}
</script>

<template>
    <header class="header">
        <div class="header__container">
            <HeaderLogo />
            <div>
                <template v-if="userData">
                    <div class="header__user">
                        <span class="header__user-name">
                            {{ userData.email }}
                        </span>
                        <HeaderLogout @logout="onLogout" />
                    </div>
                </template>
                <template v-else>
                    <div>
                        <HeaderLogin @openLogin="loginModalActions.open" />
                    </div>
                </template>
            </div>
        </div>
    </header>
    <LoginModal @set-actions="handleLoginSetActions" @open-register="openRegisterModal" />
    <RegisterModal @set-actions="handleRegisterSetActions" @open-login="openLoginModal" />
</template>

<style scoped src="@/assets/css/header.css"></style>