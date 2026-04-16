<script setup>
</script>

<template>
  <div class="landmarks-page">
    <h2>Landmarks</h2>

    <!-- Controls section -->
    <div class="controls">
      <input type="text" placeholder="Search landmarks..." />
      
      <select>
        <option value="">All Countries</option>
      </select>

      <select>
        <option value="">All Types</option>
      </select>
    </div>

    <!-- Cards grid -->
    <div class="grid">
      <div class="card-placeholder">
        Landmark Card placeholder
      </div>

      <div class="card-placeholder">
        Landmark Card placeholder
      </div>

      <div class="card-placeholder">
        Landmark Card placeholder
      </div>
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.card-placeholder {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>