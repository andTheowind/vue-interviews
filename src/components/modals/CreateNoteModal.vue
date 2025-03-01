<script setup lang="ts">
import { ref, defineEmits, onMounted, defineExpose } from 'vue';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/assets/utils/constants/environments';
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

const submitNote = async () => {
  errorList.value = [];
  const token = Cookies.get('accessToken');
  if (!token) {
    errorList.value.push("Отсутствует токен аутентификации");
    return;
  }

  const response = await fetch(`${BACKEND_URL}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title: noteTitle.value, content: noteContent.value })
  });

  if (response.ok) {
    const newNote = await response.json();
    emit('create-note', newNote);
    noteTitle.value = '';
    noteContent.value = '';
    closeModal();
  } else {
    const data = await response.json();
    errorList.value = Array.isArray(data.message) ? data.message : [data.message];
  }
};

defineExpose({ openModal, closeModal });

onMounted(() => {
  emit('set-actions', { open: openModal, close: closeModal });
});
</script>

<template>
  <ModalWrapper :isOpen="isOpen" @close="closeModal">
    <h2 class="modal__title">Добавление заметки</h2>
    <form @submit.prevent="submitNote" class="modal__form">
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