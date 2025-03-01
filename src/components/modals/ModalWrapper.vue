<script setup lang="ts">
defineProps<{ isOpen: boolean; }>();

const emit = defineEmits(['close']);
</script>

<template>
    <div class="modal" v-if="isOpen">
        <div class="modal__overlay" @click="emit('close')"></div>
        <div class="modal__content">
            <button class="modal__close" @click="emit('close')">
                <img src="@/assets/img/close-btn.svg" alt="Закрыть">
            </button>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped src="@/assets/css/modal-wrapper.css"></style>