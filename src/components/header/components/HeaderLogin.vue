<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['openLogin']);
</script>

<template>
    <a class="header__button" @click="emit('openLogin')">
        <img class="header__button-icon" src="@/assets/img/login-icon.svg" alt="">
        <span class="header__button-text">Вход</span>
    </a>
</template>

<style scoped src="@/assets/css/header-login.css"></style>
