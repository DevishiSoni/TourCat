// Router (frontend)
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Landmarks from '../pages/Landmarks.vue'
import Details from '../pages/Details.vue'
import AddLandmark from '../pages/AddLandmark.vue'
import Contact from '../pages/Contact.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/landmarks',
      name: 'landmarks',
      component: Landmarks
    },
    {
      path: '/landmarks/:id',
      name: 'details',
      component: Details
    },
    {
      path: '/add',
      name: 'add',
      component: AddLandmark
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    }
  ]
})

export default router