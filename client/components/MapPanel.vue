<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps({
  landmarks: {
    type: Array,
    default: () => []
  },
  selectedLandmark: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['marker-click'])

const mapElement = ref(null)

let map = null
let markersLayer = null
let markerRefs = new Map()

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function hasCoords(landmark) {
  return typeof landmark?.latitude === 'number' && typeof landmark?.longitude === 'number'
}

function popupHtml(landmark) {
  return `
    <div>
      <strong>${landmark.name}</strong><br />
      ${landmark.city}, ${landmark.country}<br />
      ${landmark.type ?? 'Unknown type'}
    </div>
  `
}

function focusLandmark(landmark) {
  if (!map || !hasCoords(landmark)) return

  map.flyTo([landmark.latitude, landmark.longitude], 6, {
    duration: 1.2
  })

  const marker = markerRefs.get(landmark.id)
  if (marker) {
    marker.openPopup()
  }
}

function renderMarkers() {
  if (!map || !markersLayer) return

  markersLayer.clearLayers()
  markerRefs = new Map()

  const validLandmarks = props.landmarks.filter(hasCoords)

  validLandmarks.forEach((landmark) => {
    const marker = L.marker([landmark.latitude, landmark.longitude], {
      icon: defaultIcon
    })
      .bindPopup(popupHtml(landmark))
      .on('click', () => emit('marker-click', landmark))

    marker.addTo(markersLayer)
    markerRefs.set(landmark.id, marker)
  })

  if (props.selectedLandmark && hasCoords(props.selectedLandmark)) {
    focusLandmark(props.selectedLandmark)
    return
  }

  if (validLandmarks.length === 1) {
    map.setView([validLandmarks[0].latitude, validLandmarks[0].longitude], 6)
    return
  }

  if (validLandmarks.length > 1) {
    const bounds = L.latLngBounds(
      validLandmarks.map((landmark) => [landmark.latitude, landmark.longitude])
    )
    map.fitBounds(bounds, { padding: [30, 30] })
  }
}

onMounted(() => {
  map = L.map(mapElement.value).setView([20, 0], 2)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  renderMarkers()
})

watch(
  () => props.landmarks,
  () => {
    renderMarkers()
  },
  { deep: true }
)

watch(
  () => props.selectedLandmark,
  (landmark) => {
    focusLandmark(landmark)
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div ref="mapElement" class="map-panel"></div>
</template>

<style scoped>
.map-panel {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
}
</style>