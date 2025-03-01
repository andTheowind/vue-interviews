<script setup lang="ts">
import { onMounted } from 'vue';
import {
  notes,
  createNoteModal,
  openCreateNoteModal,
  handleCreateNote,
  handleDeleteNote,
  loadNotes,
} from '@/composable/api'
import HeaderLayout from '@/components/header/HeaderLayout.vue';
import CreateNoteModal from '@/components/modals/CreateNoteModal.vue';

onMounted(() => {
  loadNotes()
})
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
                <img class="note__delete-icon" src="@/assets/img/remove-note-btn-img.svg" alt="" />
                <span class="note__delete-text">Удалить</span>
              </button>
            </div>
          </article>
        </li>
      </ul>
    </section>
    <a class="floating__button" @click="openCreateNoteModal">
      <img src="@/assets/img/plus-icon.svg" class="floating__button-icon" alt="Добавить заметку" />
    </a>
    <CreateNoteModal ref="createNoteModal" @create-note="handleCreateNote" />
  </div>
</template>

<style scoped src="@/assets/css/note-page.css"></style>