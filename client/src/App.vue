<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="layout">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/landmarks">Landmarks</RouterLink> |
          <RouterLink to="/add">Add</RouterLink> |
          <RouterLink to="/contact">Contact</RouterLink>
        </nav>
      </div>
    </header>
  </div>

  <RouterView />
</template>

<style>
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
  background-color: #9cc2fc6c;
}

nav a {
  font-weight: bold;
  color: #444444;
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
</style>