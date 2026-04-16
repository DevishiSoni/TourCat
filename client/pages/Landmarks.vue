<script setup>
import LandmarkCard from '../components/LandmarkCard.vue'

const landmarks = [
  {
    name: "CN Tower",
    image: "/images/cnTower.jpg",
    description: "Iconic tower in Toronto"
  },
  {
    name: "Eiffel Tower",
    image: "/images/eiffelTower.jpg",
    description: "Famous landmark in Paris"
  },
  {
    name: "Statue of Liberty",
    image: "/images/statueOfLiberty.jpg",
    description: "Symbol of freedom in New York"
  }
]
</script>

<template>
  <div class="landmarks-page">
    <h2>Landmarks</h2>

    <!-- Controls (placeholder for now) -->
    <div class="controls">
      <input type="text" placeholder="Search landmarks..." />
      <select>
        <option>All Countries</option>
      </select>
      <select>
        <option>All Types</option>
      </select>
    </div>

    <!-- Cards -->
    <div class="grid">
      <LandmarkCard
        v-for="(landmark, index) in landmarks"
        :key="index"
        :landmark="landmark"
      />
    </div>
  </div>
</template>

<style>
.landmarks-page {
  padding: 20px;
}

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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 20px;
}
</style>