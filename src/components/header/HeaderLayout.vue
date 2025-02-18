<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie'; 

import LoginModal from '@/components/modals/LoginModal.vue';
import RegisterModal from '@/components/modals/RegisterModal.vue';

const loginModalActions = ref<{ open?: () => void; close?: () => void }>({});
const registerModalActions = ref<{ open?: () => void; close?: () => void }>({});

const userData = ref<{ id: number; email: string } | null>(null); 
const backendUrl = "https://dist.nd.ru";

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
      const response = await fetch(`${backendUrl}/api/auth`, {
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

const isVisible = ref(false);

const logout = () => {
    Cookies.remove('accessToken');
    userData.value = null;
    isVisible.value = false;
    window.location.href = '/';
};
</script>

<template>
    <header class="header">
        <div class="header__container">
            <div class="header__logo">
                <a href="/" class="header__logo-link">
                    <img src="@/assets/img/logo.svg" alt="MyNotes" class="header__logo-icon" />
                </a>
            </div>
            <div>
                <template v-if="userData">
                    <div class="header__user">
                        <span class="header__user-name">
                            {{ userData.email }}
                        </span>
                        <a href="/logout" class="header__button-profile" @click.prevent="isVisible = !isVisible">
                            <img src="@/assets/img/user-icon.svg" class="header__user-icon" alt="">
                            <div class="header__lougout-wrapper"  v-if="isVisible"> 
                                <a href="/logout" class="header__lougout" @click="logout">Выход</a>
                            </div>
                        </a>
                    </div>
                </template>
                <template v-else>
                    <button class="header__button" @click="loginModalActions.open">
                        <img class="header__button-icon" src="@/assets/img/login-icon.svg" alt="">
                        <span class="header__button-text">Вход</span>
                    </button>
                </template>
            </div>
        </div>
    </header>
    <LoginModal @set-actions="handleLoginSetActions" @open-register="openRegisterModal"/>
    <RegisterModal @set-actions="handleRegisterSetActions" @open-login="openLoginModal"/>
</template>

<style scoped>
@import url('@/assets/css/header.css');
</style>