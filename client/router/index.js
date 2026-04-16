//client/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// temporary simple pages
const Home = { template: '<h2>Home Page</h2>' }
const Landmarks = { template: '<h2>Landmarks Page</h2>' }
const Store = { template: '<h2>Store Page</h2>' }
const About = { template: '<h2>About Page</h2>' }

const routes = [
  { path: '/', component: Home },
  { path: '/landmarks', component: Landmarks },
  { path: '/store', component: Store },
  { path: '/about', component: About }
]

export default createRouter({
  history: createWebHistory(),
  routes
})