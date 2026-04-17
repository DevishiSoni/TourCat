<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const landmark = ref(null)

// Fetch single landmark
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/landmarks/${route.params.id}`)
    landmark.value = await res.json()
  } catch (err) {
    console.error("Error fetching landmark:", err)
  }
})

// Toggle favourite
const toggleFavourite = async () => {
  try {
    await fetch(`http://localhost:3000/api/landmarks/${route.params.id}/favourite`, {
      method: 'PATCH'
    })

    // update UI instantly
    landmark.value.favourite = !landmark.value.favourite
  } catch (err) {
    console.error("Error updating favourite:", err)
  }
}
</script>

<template>
  <div v-if="landmark" class="details-wrapper">

    <!-- Back Button -->
    <button class="back-btn" @click="$router.back()">← Back</button>

    <div class="details-page">

      <!-- Image + Heart -->
      <div class="image-container">
        <img
          :src="landmark.image || 'https://via.placeholder.com/800x400'"
          alt="landmark image"
          class="details-image"
        />

        <!-- Heart -->
        <button class="heart-btn" @click="toggleFavourite">
          <span :class="{ fav: landmark.favourite }">♥</span>
        </button>
      </div>

      <!-- Content -->
      <div class="details-content">
        <h2>{{ landmark.name }}</h2>

        <p class="location">
          {{ landmark.city }}, {{ landmark.country }}
        </p>

        <p class="type">
          {{ landmark.type }}
        </p>

        <p class="description">
          {{ landmark.description || "No description available." }}
        </p>
      </div>

    </div>

  </div>

  <p v-else>Loading...</p>
</template>

<style scoped>
.details-wrapper {
  max-width: 900px;
  margin: 20px auto;
}

/* Back button */
.back-btn {
  margin-bottom: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 14px;
}

/* Card container */
.details-page {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

/* Image section */
.image-container {
  position: relative;
}

.details-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

/* Heart button */
.heart-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border-radius: 50%;
  border: 1px solid #ccc;
  padding: 6px 10px;
  cursor: pointer;
}

/* Heart styles */
.heart-btn span {
  color: white;
  -webkit-text-stroke: 1px black;
  font-size: 20px;
}

.heart-btn span.fav {
  color: red;
  -webkit-text-stroke: 0;
}

/* Content */
.details-content {
  padding: 20px;
  text-align: left;
}

.details-content h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.location {
  color: #777;
  margin-bottom: 6px;
}

.type {
  display: inline-block;
  background: #eef3ff;
  color: #007bff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 16px;
}

.description {
  color: #555;
  line-height: 1.6;
}
</style>