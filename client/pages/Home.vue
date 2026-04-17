<!-- client/pages/Home.vue -->
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to TourCat</h1>
      <p class="subtitle">Discover Your Ontario!</p>
      <RouterLink to="/landmarks" class="cta-btn">Explore Landmarks</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.hero {
  text-align: center;
  padding: 40px;
}

.hero h1 {
  font-size: 56px;
  color: #444444;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  color: #777777;
  margin-bottom: 32px;
}

.cta-btn {
  display: inline-block;
  padding: 14px 32px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.2s;
}

.cta-btn:hover {
  background-color: #0056b3;
}
</style>