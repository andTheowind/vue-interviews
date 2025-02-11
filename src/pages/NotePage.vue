<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import HeaderLayout from '@/components/header/HeaderLayout.vue';
import CreateNoteModal from '@/components/modals/CreateNoteModal.vue';

// URL бэкенда
const backendUrl = "https://dist.nd.ru";
// массив заметок
const notes = ref<{ title: string; content: string; id: number }[]>([]);

// функция для загрузки заметок
const loadNotes = async () => {
  const token = Cookies.get('accessToken');
  if (!token) return; // если токен отсутствует, выходим
  
  try {
    const response = await fetch(`${backendUrl}/api/notes`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      notes.value = Array.isArray(data) ? data : []; // обновляем заметки
    } else {
      console.error('Не удалось загрузить заметки');
    }
  } catch (error) {
    console.error('Ошибка при загрузке заметок:', error);
  }
};

// выполняется при монтировании компонента
onMounted(() => {
  loadNotes();
});

// ссылка на модальное окно создания заметки
const createNoteModal = ref<InstanceType<typeof CreateNoteModal> | null>(null);

// функция для открытия модального окна создания заметки
const openCreateNoteModal = () => {
  if (createNoteModal.value) {
    createNoteModal.value.openModal();
  }
};

// обработчик создания заметки
const handleCreateNote = (note: { title: string; content: string; id: number }) => {
  notes.value.push(note); // добавляем новую заметку в массив
};

// обработчик удаления заметки
const handleDeleteNote = async (noteId: number) => {
  const token = Cookies.get('accessToken');
  
  // если токен отсутствует, выходим
  if (!token) return; 

  try {
    const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      // удаляем заметку из массива
      notes.value = notes.value.filter(note => note.id !== noteId); 
    } else {
      console.error('Не удалось удалить заметку');
    }
  } catch (error) {
    console.error('Ошибка при удалении заметки:', error);
  }
};
</script>

<template>
  <div>
    <HeaderLayout />
    <section class="notes">
      <ul class="notes__list">
        <li class="notes__item" v-for="note in notes" :key="note.id">
          <article class="note">
            <div class="note__header">
              <h3 class="note__title">{{ note.title }}</h3>
            </div>
            <div class="note__content">{{ note.content }}</div>
            <div class="note__footer">
              <button class="note__delete" @click="handleDeleteNote(note.id)">
                  <img class="note__delete-icon" src="@/assets/img/remove-note-btn-img.svg" alt="">
                  <span class="note__delete-text">Удалить</span>
              </button>
            </div>
          </article>
        </li>
      </ul>
    </section>
    <button class="floating__button" @click="openCreateNoteModal">
      <img src="@/assets/img/plus-icon.svg" class="floating__button-icon" alt="">
    </button>
    <CreateNoteModal ref="createNoteModal" @create-note="handleCreateNote" />
  </div>
</template>


<style scoped>
.floating__button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #a6ce39;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
  outline: none;
}

.floating__button:hover {
  background: #8fbf33;
}

.floating__button-icon {
  max-width: 100%;
  height: auto;
}

.notes {
  margin-top: 30px;
  padding: 10px 25px;
}

.notes__list {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
  list-style: none;
  padding: 0;
}

.notes__item {
  width: calc(33.333% - 28px);
}

.note {
  display: flex;
  flex-direction: column;
  background-color: #B1C909;
  border-top-left-radius: 12px;
  outline: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: relative;
  color: #fff;
  box-shadow: 0px 15px 15px -10px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 0;
}

.note::before {
  content: " ";
  position: absolute;
  top: 0px;
  right: 0px;
  width: 39.5px;
  height: 39.5px;
  background-image: url("@/assets/img/msg-decorative-el-r.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgb(10, 31, 56);
  z-index: 10;
  overflow: hidden;
}

.note__header {
  padding: 24px 25px 20px 25px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
}

.note__title {
  font-weight: 500;
  font-size: 20px;
  max-width: 85%; 
}

.note__content {
  flex-grow: 1;
  padding: 20px 25px;
  font-size: 18.5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
}

.note__footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 25px 20px 25px; 
}

.note__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: none;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  padding: 4px 0 0 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 6px;
  transition: all 0.2s;
}

.note__delete-icon {
  width: 14px;
  height: 14px;
  max-width: 100%;
}

.note__delete-text {
  display: inline-block;
  font-size: 19px;
  padding-left: 4px;
}
</style>