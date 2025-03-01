<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    errorList: string[]
}>()
</script>

<template>
    <div v-if="errorList.length" class="modal__errors">
        <ul class="modal__errors-list">
            <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
    </div>
</template>

<style scoped src="@/assets/css/modal-errors.css"></style>