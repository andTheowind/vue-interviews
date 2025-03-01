<script setup lang="ts">
import { ref, defineProps, defineModel } from 'vue';

defineProps<{
    name: string
    label?: string
    placeholder?: string
    type: 'email' | 'password' | 'text'
    required: boolean
}>()

const modelValue = defineModel();
const showPassword = ref(false);
</script>

<template>
    <div class="modal__form-group">

        <label v-if="label" :for="name" class="modal__label">{{ label }}</label>

        <div v-if="type === 'password'" class="modal__input-wrapper">
            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="modelValue" class="modal__input"
                :placeholder="placeholder" :required="required" />
            <span @click="showPassword = !showPassword" class="modal__button-visibillity">
                <img src="@/assets/img/visibillity-icon.svg" alt="">
            </span>
        </div>

        <input v-else :id="name" :type="type" v-model="modelValue" class="modal__input" :placeholder="placeholder"
            :required="required" />

    </div>
</template>

<style scoped src="@/assets/css/base-field.css"></style>