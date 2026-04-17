<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import LandmarkCard from '../components/LandmarkCard.vue'
import MapPanel from '../components/MapPanel.vue'
import { updateLandmark, deleteLandmark as deleteLandmarkAPI } from '../src/services/clientServices.js'
import { useRouter } from 'vue-router'
import $ from 'jquery'

const router = useRouter()
const landmarks = ref([])
const selectedLandmark = ref(null)
const search = ref('')
const selectedCountry = ref('')
const selectedType = ref('')
const gridRef = ref(null)

const goToDetails = (id) => {
  router.push(`/landmarks/${id}`)
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

const fetchLandmarks = async () => {
  try {
    let url = 'http://localhost:3000/api/landmarks?'

    // Search by city
    if (search.value) {
      url += `city=${search.value}`
    }
    
    // Dropdown country filter
    if (selectedCountry.value) {
      url += `country=${selectedCountry.value}&`
    }

    // Type filter
    if (selectedType.value) {
      url += `type=${selectedType.value}&`
    }

    const res = await fetch(url)
    const data = await res.json()

    landmarks.value = data
  } catch (err) {
    console.error("FETCH ERROR:", err)
  }
}

onMounted(fetchLandmarks)

</script>

<template>
  <div class="landmarks-page">

    <h2>Landmarks</h2>

    <!-- Controls (not functional yet, just UI placeholder) -->
    <div class="controls">
      <input
        v-model="search"
        @input="fetchLandmarks"
        placeholder="Search by city..."
      />
      <select v-model="selectedCountry" @change="fetchLandmarks">
        <option value="">All Countries</option>
        <option value="Canada">Canada</option>
        <option value="USA">USA</option>
        <option value="Brazil">Brazil</option>
        <option value="India">India</option>
        <option value="China">China</option>
        <option value="Japan">Japan</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="France">France</option>
        <option value="Italy">Italy</option>
        <option value="Australia">Australia</option>
      </select>

      <select v-model="selectedType" @change="fetchLandmarks">
        <option value="">All Types</option>
        <option value="Historical">Historical</option>
        <option value="Modern">Modern</option>
        <option value="Natural">Natural</option>
        <option value="Religious">Religious</option>
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