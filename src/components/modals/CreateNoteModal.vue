<script setup lang="ts">
import { ref, defineEmits, onMounted, defineExpose } from 'vue';
import { submitNote } from '@/composable/api';
import ModalWrapper from './ModalWrapper.vue';

const emit = defineEmits(['close', 'create-note', 'set-actions']);

const isOpen = ref(false);
const noteTitle = ref('');
const noteContent = ref('');
const errorList = ref<string[]>([]);
const titleLength = ref(0);
const contentLength = ref(0);

const openModal = () => { isOpen.value = true; };
const closeModal = () => { isOpen.value = false; };
const updateTitleLength = () => { titleLength.value = noteTitle.value.length; };
const updateContentLength = () => { contentLength.value = noteContent.value.length; };

defineExpose({ openModal, closeModal });

onMounted(() => {
  emit('set-actions', { open: openModal, close: closeModal });
});
</script>

<template>
  <ModalWrapper :isOpen="isOpen" @close="closeModal">
    <h2 class="modal__title">Добавление заметки</h2>
    <form @submit.prevent="() => submitNote(errorList, noteTitle, noteContent, closeModal, emit)" class="modal__form">
      <div class="modal__form-group">
        <label for="noteTitle" class="modal__label">Заголовок</label>
        <input id="noteTitle" type="text" v-model="noteTitle" @input="updateTitleLength" placeholder="Введите название"
          required class="modal__input" />
        <div class="modal__counter">{{ titleLength }}/100</div>
      </div>
      <div class="modal__form-group">
        <label for="noteContent" class="modal__label">Текст заметки</label>
        <textarea id="noteContent" v-model="noteContent" @input="updateContentLength"
          placeholder="Введите текст заметки" class="modal__textarea" required></textarea>
        <div class="modal__counter">{{ contentLength }}/1000</div>
      </div>
      <div v-if="errorList.length" class="modal__errors">
        <ul>
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
      <button type="submit" class="modal__button">Добавить</button>
    </form>
  </ModalWrapper>
</template>

<style scoped src="@/assets/css/create-note-modal.css"></style>