<script setup>
import { ref, onMounted } from 'vue'
import LandmarkCard from '../components/LandmarkCard.vue'
import MapPanel from '../components/MapPanel.vue'
import { updateLandmark, deleteLandmark as deleteLandmarkAPI } from '../src/services/clientServices.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const landmarks = ref([])
const selectedLandmark = ref(null)

// 👇 ADD FUNCTIONS HERE
const goToDetails = (id) => {
  const found = landmarks.value.find((landmark) => landmark.id === id)
  if (found) {
    selectedLandmark.value = found
  }
}

const editLandmark = (id) => {
  router.push(`/edit/${id}`)
}

const deleteLandmark = async (id) => {
  try {
    await deleteLandmarkAPI(id)
    landmarks.value = landmarks.value.filter(l => l.id !== id)
    if (selectedLandmark.value?.id === id) {
      selectedLandmark.value = landmarks.value[0] ?? null
    }
  } catch (err) {
    console.error('Delete failed:', err)
  }
}

const toggleFavourite = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/landmarks/${id}/favourite`, {
      method: 'PATCH'
    })

    if (!res.ok) {
      throw new Error('Failed to toggle favourite')
    }

    const updatedLandmark = await res.json()

    landmarks.value = landmarks.value.map((landmark) =>
      landmark.id === updatedLandmark.id ? updatedLandmark : landmark
    )

    if (selectedLandmark.value?.id === updatedLandmark.id) {
      selectedLandmark.value = updatedLandmark
    }
  } catch (err) {
    console.error(err)
  }
}

// fetch data
onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/landmarks')
    landmarks.value = await res.json()

    if (landmarks.value.length > 0) {
      selectedLandmark.value = landmarks.value[0]
    }
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

    <!-- Map -->
    <div class="map-wrapper">
      <MapPanel
        :landmarks="landmarks"
        :selected-landmark="selectedLandmark"
      />
    </div>

    <!-- Cards Grid -->
    <div class="grid">
      <LandmarkCard
        v-for="landmark in landmarks"
        :key="landmark.id"
        :landmark="landmark"
        @select="goToDetails"
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

.map-wrapper {
  margin-bottom: 24px;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}
</style>