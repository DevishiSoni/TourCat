<!-- client/pages/Home.vue -->
<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import StatsChart from '../components/StatsChart.vue'
import { getLocations } from '../src/services/clientServices.js'

const landmarks = ref([])
const loading = ref(true)
const error = ref('')
const showFavourites = ref(false)

const totalLandmarks = computed(() => landmarks.value.length)

const favouriteLandmarks = computed(() =>
  landmarks.value.filter((landmark) => landmark.favourite)
)

const countryCount = computed(() =>
  new Set(landmarks.value.map((landmark) => landmark.country)).size
)

const chartData = computed(() => {
  const counts = {}

  landmarks.value.forEach((landmark) => {
    const key = landmark.country || 'Unknown'
    counts[key] = (counts[key] || 0) + 1
  })

  return Object.entries(counts).map(([label, value]) => ({
    label,
    value
  }))
})

onMounted(async () => {
  try {
    const response = await getLocations()
    const payload = response.data

    landmarks.value = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.landmarks)
        ? payload.landmarks
        : []
  } catch (err) {
    error.value = 'Failed to load homepage stats.'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to TourCat</h1>
      <p class="subtitle">Discover The World!</p>

      <div class="favourites-dropdown">
        <button class="fav-toggle" @click="showFavourites = !showFavourites">
          Your Favourites
          <span class="dropdown-arrow">{{ showFavourites ? '▲' : '▼' }}</span>
          : {{ favouriteLandmarks.length }}
        </button>

        <ul v-if="showFavourites" class="fav-list">
          <li v-if="favouriteLandmarks.length === 0" class="fav-empty">
            No favourites yet
          </li>
          <li
            v-for="landmark in favouriteLandmarks"
            v-else
            :key="landmark.id"
            class="fav-item"
          >
            {{ landmark.name }}
          </li>
        </ul>
      </div>

      <RouterLink to="/landmarks" class="cta-btn">Explore Landmarks</RouterLink>
    </div>

    <div class="stats-section">
      <p v-if="loading">Loading stats...</p>
      <p v-else-if="error">{{ error }}</p>

      <template v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <h2>{{ totalLandmarks }}</h2>
            <p>Total Landmarks</p>
          </div>

          <div class="stat-card">
            <h2>{{ countryCount }}</h2>
            <p>Countries Represented</p>
          </div>
        </div>

        <div class="chart-section">
          <h2>Landmarks by Country</h2>
          <StatsChart :data="chartData" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
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

/* favourites dropdown */
.favourites-dropdown {
  margin-bottom: 32px;
}

.fav-toggle {
  background: none;
  border: none;
  font-size: 20px;
  color: #777777;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.dropdown-arrow {
  font-size: 14px;
}

.fav-list {
  list-style: none;
  margin: 12px auto 0;
  padding: 12px 16px;
  max-width: 320px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.fav-item {
  padding: 4px 0;
  color: #444444;
}

.fav-empty {
  color: #777777;
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

/* chart styles */

.stats-section {
  width: 100%;
  max-width: 1100px;
  margin-top: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.stat-card h2 {
  margin: 0 0 0.4rem 0;
  font-size: 2rem;
  color: #444444;
}

.stat-card p {
  margin: 0;
  color: #777777;
}

.chart-section {
  width: 100%;
}

.chart-section h2 {
  margin-bottom: 1rem;
  text-align: center;
  color: #444444;
}
</style>