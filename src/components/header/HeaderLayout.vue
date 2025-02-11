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
.header {
    padding: 20px;
}

.header__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header__logo {
    display: flex;
    align-items: center;
    color: #a6ce39;
    font-size: 24px;
    font-weight: bold;
}

.header__logo-icon {
    max-width: 100%;
    height: auto;
    margin-right: 8px;
}

.header__user {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.header__user-name {
    display: inline-block;
    margin-right: 12px;
    color: #fff;
}

.header__user-icon {
    max-width: 100%;
    height: auto;
}

.header__button {
    background-color: #a6ce39;
    border: none;
    padding: 11px 24px;
    border-radius: 32px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.5px;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.35s;
    gap: 11px;
}

.header__button:hover {
    background-color: #8fbf33;
}

.header__button-text {
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    display: inline-block;
}

.header__button-icon {
    max-width: 100%;
    height: auto;
}

.header__button-profile {
    position: relative;
}

.header__lougout-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50px;
    left: -20px;
    width: 100px;
    height: 70px;
    background-color: #1b2f46;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    color: #B1C909;
    margin-top: 20px;
    z-index: 99;
}

.header__lougout {
    color: #B1C909;
    text-decoration: none;
    font-size: 18px;
    height: 100%;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;    
}
</style>