<script setup lang="ts">
import { ref, defineEmits, onMounted, defineExpose } from 'vue';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/assets/utils/constants/environments';

const emit = defineEmits(['close', 'create-note', 'set-actions']);
const isOpen = ref(false);
const noteTitle = ref('');
const noteContent = ref('');
const errorList = ref<string[]>([]);

const openModal = () => { isOpen.value = true; };
const closeModal = () => { isOpen.value = false; };

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
  <div class="modal" v-if="isOpen">
    <div class="modal__overlay" @click="closeModal"></div>
    <div class="modal__content">
      <button class="modal__close" @click="closeModal">
        <img src="@/assets/img/close-btn.svg" alt="">
      </button>
      <h2 class="modal__title">Добавление заметки</h2>
      <form @submit.prevent="submitNote" class="modal__form">
        <div class="modal__form-group">
          <label for="noteTitle" class="modal__label">Заголовок</label>
          <input id="noteTitle" type="text" v-model="noteTitle" placeholder="Введите заголовок" required class="modal__input"/>
        </div>
        <div class="modal__form-group">
          <label for="noteContent" class="modal__label">Текст заметки</label>
          <textarea id="noteContent" v-model="noteContent" placeholder="Введите текст заметки" required class="modal__textarea"></textarea>
        </div>
        <div v-if="errorList.length" class="modal__errors">
          <ul>
            <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
          </ul>
        </div>
        <button type="submit" class="modal__button">Добавить</button>
      </form>
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
}

.modal__overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

.modal__content {
  background: #1a2b44;
  padding: 40px;
  border-radius: 40px;
  max-width: 420px;
  color: #fff;
  position: relative;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #a6ce39;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__title {
  font-size: 38px;
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
  margin-bottom: 8px;
  margin-left: 24px;
}

.modal__label {
  font-size: 14px;
  font-weight: 400;
  color: #9DA5AF;
}

.modal__input,
.modal__textarea {
  padding: 14px 14px 14px 28px;
  border-radius: 28px;
  border: none;
  font-size: 16px;
  background: #fff;
  color: #9DA5AF;
  font-family: "Montserrat", serif;
  width: 100%;
}


.modal__input::placeholder,
.modal__textarea::placeholder {
  font-family: "Montserrat", sans-serif;
}


.modal__textarea {
  resize: vertical;
  min-height: 120px;
}

.modal__input:focus,
.modal__textarea:focus {
  outline: 1px solid #a6ce39;
}

.modal__button {
  display: inline-flex;
  justify-content: center;
  align-self: flex-end;
  background-color: #a6ce39;
  margin-top: 24px;
  padding: 17px 10px;
  border: none;
  border-radius: 34px;
  font-size: 19px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1px;
  color: #fff;
  width: 100%;
  max-width: 152px;
  transition: background-color 0.35s;
  text-align: center;
}

.modal__button:hover {
  background: #8fbf33;
}

.modal__errors {
  background: rgba(255, 0, 0, 0.2);
  padding: 10px;
  border-radius: 15px;
  text-align: center;
  margin-top: 10px;
}

.modal__errors ul {
  margin-top: 8px;
  padding: 8px 14px;
  font-size: 14px;
  color: #FF7461;
  background-color: rgba(255, 116, 97, 0.1);
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
    .modal__content {
        max-width: 780px;
        padding: 74px 80px 74px 80px;
    }

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
