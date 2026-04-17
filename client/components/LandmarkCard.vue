<script setup>
import { ref } from 'vue'

const props = defineProps({
  landmark: Object
})

const emit = defineEmits(['view', 'edit', 'delete'])

// local favourite state
const isFavourite = ref(props.landmark.favourite)

// toggle heart
const toggleFavourite = () => {
  isFavourite.value = !isFavourite.value
  emit('favourite', props.landmark.id)
}

// toggle dropdown
const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// actions
const viewDetails = () => {
  emit('view', props.landmark.id)
  showMenu.value = false
}

const editLandmark = () => {
  emit('edit', props.landmark.id)
  showMenu.value = false
}

const deleteLandmark = () => {
  emit('delete', props.landmark.id)
  showMenu.value = false
}
</script>

<template>
  <div class="card">

    <!-- Heart Icon -->
    <button class="heart-btn" @click="toggleFavourite">
        <span :class="{ fav: isFavourite }">♥</span>
    </button>

    <!-- Top bar -->
    <div class="card-header">
      <h3>{{landmark.name}}</h3>

      <!-- 3 dots -->
      <button class="menu-btn" @click="toggleMenu">⋮</button>

      <!-- Dropdown -->
      <div v-if="showMenu" class="dropdown">
        <div @click="viewDetails">View Details</div>
        <div @click="editLandmark">Edit</div>
        <div @click="deleteLandmark">Delete</div>
      </div>
    </div>

    <!-- Image -->
    <img :src="landmark.image" alt="landmark" />

    <!-- Description -->
    <p>{{ landmark.description }}</p>


  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
}

/* header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 3 dots button */
.menu-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #000000;
}

/* dropdown */
.dropdown {
  position: absolute;
  top: 40px;
  right: 10px;
  background: rgb(255, 255, 255);
  border: 1px solid #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 10;
}

.dropdown div {
  padding: 10px;
  cursor: pointer;
}

.dropdown div:hover {
  background: #f2f2f2;
}

/* image */
img {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

/* description */
p {
  font-size: 14px;
  margin-top: 10px;
}
</style>