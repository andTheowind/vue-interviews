import { ref } from 'vue';
import Cookies from 'js-cookie';
import CreateNoteModal from '@/components/modals/CreateNoteModal.vue';

interface Note {
  id: number;
  title: string;
  content: string;
}

// URL бэкенда
const backendUrl = 'https://dist.nd.ru';
// массив заметок
export const notes = ref<Note[]>([]);

// функция для загрузки заметок
export const loadNotes = async () => {
  const token = Cookies.get('accessToken');
  if (!token) return; // если токен отсутствует, выходим

  try {
    const response = await fetch(`${backendUrl}/api/notes`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      notes.value = Array.isArray(data) ? data : [];
    } else {
      console.error('Не удалось загрузить заметки');
    }
  } catch (error) {
    console.error('Ошибка при загрузке заметок:', error);
  }
};

// ссылка на модальное окно создания заметки
export const createNoteModal = ref<InstanceType<typeof CreateNoteModal> | null>(null);

// функция для открытия модального окна создания заметки
export const openCreateNoteModal = () => {
  if (createNoteModal.value) {
    createNoteModal.value.openModal();
  }
};

// обработчик создания заметки
export const handleCreateNote = (note: { title: string; content: string; id: number }) => {
  notes.value.push(note); 
};

// обработчик удаления заметки
export const handleDeleteNote = async (noteId: number) => {
  const token = Cookies.get('accessToken');

  // если токен отсутствует, выходим
  if (!token) return;

  try {
    const response = await fetch(`${backendUrl}/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      notes.value = notes.value.filter((note) => note.id !== noteId);
    } else {
      console.error('Не удалось удалить заметку');
    }
  } catch (error) {
    console.error('Ошибка при удалении заметки:', error);
  }
};
