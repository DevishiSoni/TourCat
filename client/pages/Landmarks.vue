<script setup>
import { ref, onMounted } from 'vue'
import LandmarkCard from '../components/LandmarkCard.vue'

const landmarks = ref([])

// 👇 ADD FUNCTIONS HERE
const goToDetails = (id) => {
  console.log("View:", id)
}

const editLandmark = (id) => {
  console.log("Edit:", id)
}

const deleteLandmark = (id) => {
  console.log("Delete:", id)
}

const toggleFavourite = (id) => {
  console.log("Favourite toggled:", id)
}

// fetch data
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/landmarks')
    landmarks.value = await res.json()
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div class="landmarks-page">

    <h2>Landmarks</h2>

    <!-- Controls (not functional yet, just UI placeholder) -->
    <div class="controls">
      <input type="text" placeholder="Search landmarks..." />
      <select>
        <option value="">All Countries</option>
      </select>
      <select>
        <option value="">All Types</option>
      </select>
    </div>

    <!-- Cards Grid -->
    <div class="grid">
      <LandmarkCard
        v-for="landmark in landmarks"
        :key="landmark.id"
        :landmark="landmark"
        @view="goToDetails"
        @edit="editLandmark"
        @delete="deleteLandmark"
        @favourite="toggleFavourite"
      />
    </div>

  </div>
</template>

<style>
.landmarks-page {
  padding: 20px;
}

/* Controls section */
.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.controls input,
.controls select {
  padding: 8px;
  font-size: 14px;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}
</style>