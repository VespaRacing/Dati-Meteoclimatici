import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClassificaView from '../views/ClassificaView.vue'
import RegioniView from '../views/RegioniView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/classifica',
    name: 'classifica',
    component: ClassificaView  // Ensure this component is correctly referenced
  },
  {
    path: '/regioni',
    name: 'regioni',
    component: RegioniView  // Ensure this component is correctly referenced
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
