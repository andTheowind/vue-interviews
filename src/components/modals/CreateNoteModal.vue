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
        <input 
          id="noteTitle" 
          type="text" 
          v-model="noteTitle" 
          @input="updateTitleLength"
          placeholder="Введите название" 
          required class="modal__input"
        />
        <div class="modal__counter">{{ titleLength }}/100</div>
      </div>
      <div class="modal__form-group">
        <label for="noteContent" class="modal__label">Текст заметки</label>
        <textarea 
          id="noteContent" 
          v-model="noteContent" 
          @input="updateContentLength"
          placeholder="Введите текст заметки"
          class="modal__textarea" required></textarea>
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

<style scoped>
.modal__title {
    font-size: 32px;
    margin-bottom: 25px;
    font-weight: bold;
}
.modal__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.modal__form-group .modal__label {
    display: block;
    margin-left: 24px;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 400;
    color: #9DA5AF; 
}
.modal__input, .modal__textarea {
    padding: 14px 14px 14px 28px;
    border-radius: 28px;
    border: none;
    font-size: 16px;
    background: #fff;
    color: #9DA5AF;
    font-family: "Montserrat", serif;
    width: 100%;
}
.modal__textarea {
    resize: vertical;
    min-height: 120px;
}
.modal__button {
    align-self: flex-end;
    display: inline-block;
    background-color: #a6ce39;
    margin-top: 24px;
    padding: 17px 24px;
    border: none;
    border-radius: 34px;
    font-size: 19px;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 1px;
    color: #fff;
    width: 100%;
    max-width: fit-content;
    transition: background-color 0.35s;
    text-align: center;
}
.modal__button:hover {
    background: #8fbf33;
}

.modal__counter {
    justify-self: flex-end;
    margin-right: 24px;
    margin-top: 8px;
    font-size: 14px;
    color: #9DA5AF;
}

input ~ .modal__counter {
    margin-top: 12px;
}
.modal__errors {
    align-self: flex-start;
}

.modal__errors ul {
    margin-top: 8px;
    padding: 8px 14px 8px 14px;
    font-size: 14px;
    color: #FF7461;
    background-color: rgba(255, 116, 97, 10%);
    border-radius: 24px;
}

.modal__errors ul li {
  list-style-type: none;
}

@media (min-width: 1200px) {
    .modal__title {
        font-size: 52px;
    }

    .modal__input {
        min-width: 380px;
    }
}

@media (min-width: 1440px) {
    .modal__input {
        min-width: 620px;
        padding: 27px 14px 27px 28px;
        border-radius: 36px;
    }

    .modal__textarea {
        padding: 22px 14px 14px 28px;
    }
}
</style>
