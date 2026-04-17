<!-- client/pages/AddLandmark.vue -->
<script setup>
import axios from 'axios'

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'  

const route = useRoute()
const editId = route.params.id  
const isEdit = !!editId

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
})

const imageFile = ref(null)
const imagePreview = ref(null)
const error = ref(null)
const success = ref(false)

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

onMounted(async () => {
  if (isEdit) {
    const res = await axios.get(`/api/landmarks/${editId}`)
    Object.assign(form.value, res.data)
    if (res.data.image) imagePreview.value = res.data.image
  }
})
const submitForm = async () => {
  error.value = null
  try {
    const formData = new FormData()
    Object.entries(form.value).forEach(([key, val]) => formData.append(key, val))
    formData.set('yearBuilt', form.value.yearBuilt ? parseInt(form.value.yearBuilt) : '')
    formData.set('latitude', parseFloat(form.value.latitude))
    formData.set('longitude', parseFloat(form.value.longitude))
    if (imageFile.value) formData.append('image', imageFile.value)

    if (isEdit) {
      await axios.put(`/api/landmarks/${editId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      formData.append('favourite', false)
      await axios.post('/api/landmarks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    success.value = true
    setTimeout(() => router.push('/landmarks'), 1500)
  } catch (err) {
    error.value = `Failed to ${isEdit ? 'update' : 'add'} landmark. Please try again.`
  }
}
</script>

<template>
  <div class="add-page">
    <h2>{{ isEdit ? 'Edit Landmark' : 'Add Landmark' }}</h2>

    <div v-if="success" class="success">{{ isEdit ? 'Landmark updated!' : 'Landmark added!' }} Redirecting...</div> <!-- Show success message on successful submission -->
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

      <div class="field">
        <label>Year Built</label>
        <input v-model="form.yearBuilt" type="number" placeholder="1976" />
      </div>

      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" rows="3" placeholder="A brief description of the landmark..." />
      </div>

      <div class="field">
        <label>Image</label>
        <input type="file" accept="image/*" @change="handleImageChange" />
        <img v-if="imagePreview" :src="imagePreview" class="preview" />
      </div>

      <div class="actions">
        <button class="cancel-btn" @click="router.push('/landmarks')">Cancel</button>
        <button class="submit-btn" @click="submitForm">{{ isEdit ? 'Update Landmark' : 'Add Landmark' }}</button> <!-- Change button text based on mode -->
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
  color: #6dcfbc;
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

input[type="file"] {
  padding: 8px;
  cursor: pointer;
}

textarea {
  resize: vertical;
}

.preview {
  margin-top: 10px;
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
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
}

.error {
  background: #fdecea;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
}
</style>