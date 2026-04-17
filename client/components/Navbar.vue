<script setup>
import { RouterLink } from 'vue-router'


</script>

<template>
  <nav class="navbar">
    <div class="logo">TourCat</div>
    
    <div class="links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/landmarks">Landmarks</RouterLink>
      <RouterLink to="/add">Add Landmark</RouterLink>
      <RouterLink to="/contact">Contact Us</RouterLink>
    </div>
  </nav>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: #9cc2fc6c;
}

.logo {
  font-weight: bold;
  font-size: 20px;
}

.links a {
  margin: 0 10px;
  text-decoration: none;
  font-weight: bold;
  color: #444;
}

.links a.router-link-exact-active {
  color: #007bff;
}
</style>