<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const isVisible = ref(false);
const emit = defineEmits(['logout']);
</script>

<template>
    <a href="/logout" class="header__button-profile" @click.prevent="isVisible = !isVisible">
        <img src="@/assets/img/user-icon.svg" class="header__user-icon" alt="">
        <div class="header__lougout-wrapper" v-if="isVisible">
            <a href="/logout" class="header__lougout" @click.prevent="emit('logout')">Выход</a>
        </div>
    </a>
</template>

<style scoped src="@/assets/css/header-logout.css"></style>
