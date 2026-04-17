<script setup>
import Navbar from '../components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="layout">
    <Navbar />
    <RouterView />
  </div>
</template>

<style>
#layout {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #444444;
}

#layout {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444444;
}

/* Navbar */
nav {
  padding: 20px;
  color: #6dcfbc;
}

nav a {
  font-weight: bold;
  color: #6dcfbc;
  text-decoration: none;
  margin: 0 10px;
}

/* Active link */
nav a.router-link-exact-active {
  color: #007bff;
}

/* Page headings */
h2 {
  font-size: 48px;
  color: #444444;
  margin-bottom: 20px;
}
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>