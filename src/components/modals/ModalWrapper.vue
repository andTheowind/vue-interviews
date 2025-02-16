<script setup lang="ts">
defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits(['close']);
</script>

<template>
    <div class="modal" v-if="isOpen">
        <!-- затемнённый фон для закрытия окна при клике -->
        <div class="modal__overlay" @click="emit('close')"></div>

        <!-- контент модального окна -->
        <div class="modal__content">
            <button class="modal__close" @click="emit('close')">
                <img src="@/assets/img/close-btn.svg" alt="Закрыть">
            </button>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
.modal__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.modal__content {
    background: #1a2b44;
    padding: 40px;
    border-radius: 40px;
    max-width: 500px;
    color: #fff;
    position: relative;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 90%;
}
.modal__close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #a6ce39;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
}
.modal__close:hover {
    background: #91b831;
}

@media (min-width: 1440px) {
    .modal__content {
        max-width: 780px;
        padding: 74px 80px 74px 80px;
    }
}
</style>
