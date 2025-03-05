<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const isVisible = ref(false);
const emit = defineEmits(['logout']);
</script>

<template>
    <div class="header__button-profile" @click.stop="isVisible = !isVisible">
        <img src="@/assets/img/user-icon.svg" class="header__user-icon" alt="Профиль">
        <div class="header__logout-wrapper" v-if="isVisible">
            <a href="/logout" class="header__logout" @click.prevent="emit('logout')">Выход</a>
        </div>
    </div>
</template>

<style scoped src="@/assets/css/header-logout.css"></style>
