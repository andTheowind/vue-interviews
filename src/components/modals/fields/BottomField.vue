<script setup lang="ts">
import ErrorField from './ErrorField.vue';
import { defineProps } from 'vue';

defineProps<{
    action: string
    errorList: string[]
}>()
</script>

<template>
    <div class="modal__footer">
        <div class="modal__footer-row">
            <p class="modal__signup">
                <slot class="modal__signup-link"></slot>
            </p>
            <button type="submit" class="modal__button">{{ action }}</button>
        </div>
        <div class="modal__footer-row">
            <ErrorField :errorList="errorList" />
        </div>
    </div>
</template>

<style scoped src="@/assets/css/bottom-modal.css"></style>