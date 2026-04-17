<!-- client/pages/AddLandmark.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
  name: '',
  country: '',
  city: '',
  type: '',
  yearBuilt: '',
  description: '',
  latitude: '',
  longitude: '',
  image: ''
})

const error = ref(null)
const success = ref(false)

const submitForm = async () => {
  error.value = null
  try {
    await axios.post('/api/landmarks', {
      ...form.value,
      yearBuilt: form.value.yearBuilt ? parseInt(form.value.yearBuilt) : null,
      latitude: parseFloat(form.value.latitude),
      longitude: parseFloat(form.value.longitude),
      favourite: false
    })
    success.value = true
    setTimeout(() => router.push('/landmarks'), 1500)
  } catch (err) {
    error.value = 'Failed to add landmark. Please try again.'
  }
}
</script>

<template>
  <div class="add-page">
    <h2>Add Landmark</h2>

    <div v-if="success" class="success">Landmark added! Redirecting...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="form">
      <div class="row">
        <div class="field">
          <label>Name</label>
          <input v-model="form.name" type="text" placeholder="CN Tower" required />
        </div>
        <div class="field">
          <label>Type</label>
          <select v-model="form.type">
            <option value="">Select type</option>
            <option>Historical</option>
            <option>Modern</option>
            <option>Natural</option>
            <option>Religious</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>City</label>
          <input v-model="form.city" type="text" placeholder="Toronto" />
        </div>
        <div class="field">
          <label>Country</label>
          <input v-model="form.country" type="text" placeholder="Canada" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Latitude</label>
          <input v-model="form.latitude" type="number" placeholder="43.6426" step="any" />
        </div>
        <div class="field">
          <label>Longitude</label>
          <input v-model="form.longitude" type="number" placeholder="-79.3871" step="any" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>Year Built</label>
          <input v-model="form.yearBuilt" type="number" placeholder="1976" />
        </div>
        <div class="field">
          <label>Image Path</label>
          <input v-model="form.image" type="text" placeholder="/images/cnTower.jpg" />
        </div>
      </div>

      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" rows="3" placeholder="A brief description of the landmark..." />
      </div>

      <div class="actions">
        <button class="cancel-btn" @click="router.push('/landmarks')">Cancel</button>
        <button class="submit-btn" @click="submitForm">Add Landmark</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

input, select, textarea {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  color: #444;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: #007bff;
}

textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.submit-btn {
  padding: 10px 28px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #0056b3;
}

.cancel-btn {
  padding: 10px 28px;
  background: #f0f0f0;
  color: #444;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #ddd;
}

.success {
  background: #e6f4ea;
  color: #2e7d32;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.error {
  background: #fdecea;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>