import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import NotePage from '@/pages/NotePage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/notes', name: 'Notes', component: NotePage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
