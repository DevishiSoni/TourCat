<script setup>
defineProps({
  landmark: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="card">
    <!-- Image -->
    <img
      class="card-image"
      :src="landmark.image"
      :alt="landmark.name"
    />

    <!-- Content -->
    <div class="card-content">
      <h3 class="title">{{ landmark.name }}</h3>
      <p class="description">{{ landmark.description }}</p>
    </div>
  </div>
</template>

<style>
.card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.03);
}

.card-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.card-content {
  padding: 10px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.description {
  font-size: 13px;
  color: #666;
  margin-top: 5px;
}
</style>