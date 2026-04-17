<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import LandmarkCard from '../components/LandmarkCard.vue'
import MapPanel from '../components/MapPanel.vue'
import $ from 'jquery'

const landmarks = ref([])
const selectedLandmark = ref(null)
const gridRef = ref(null)

// 👇 ADD FUNCTIONS HERE
const goToDetails = (id) => {
  const found = landmarks.value.find((landmark) => landmark.id === id)
  if (found) {
    selectedLandmark.value = found
  }
}

const editLandmark = (id) => {
  console.log("Edit:", id)
}

const deleteLandmark = (id) => {
  console.log("Delete:", id)
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

// click handler for jQuery
onMounted(() => {
  if (!gridRef.value) return

  $(gridRef.value).on('click.landmarkSelection', '.clickable-card', function () {
    $(gridRef.value).find('.clickable-card').removeClass('selected-card')
    $(this).addClass('selected-card')
  })
})

onBeforeUnmount(() => {
  if (!gridRef.value) return
  $(gridRef.value).off('.landmarkSelection')
})

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
    <div ref="gridRef" class="grid">
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