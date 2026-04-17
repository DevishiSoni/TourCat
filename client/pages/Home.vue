<!-- client/pages/Home.vue -->
<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import StatsChart from '../components/StatsChart.vue'
import { getLocations } from '../src/services/clientServices.js'

const router = useRouter()
const landmarks = ref([])
const loading = ref(true)
const error = ref('')
const showFavourites = ref(false)

const bgCanvas = ref(null)
const globeCanvas = ref(null)
let animFrameBg = null
let animFrameGlobe = null
let rot = 0

const totalLandmarks = computed(() => landmarks.value.length)
const favouriteLandmarks = computed(() => landmarks.value.filter(l => l.favourite))
const countryCount = computed(() => new Set(landmarks.value.map(l => l.country)).size)
const chartData = computed(() => {
  const counts = {}
  landmarks.value.forEach(l => {
    const key = l.country || 'Unknown'
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts).map(([label, value]) => ({ label, value }))
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

  initBg()
  initGlobe()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrameBg)
  cancelAnimationFrame(animFrameGlobe)
})

// --- STARFIELD BG ---
function initBg() {
  const canvas = bgCanvas.value
  const ctx = canvas.getContext('2d')

  function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
  resize()
  window.addEventListener('resize', resize)

  const stars = Array.from({ length: 130 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random()
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(s => {
      s.a += 0.004 * (Math.random() - 0.5)
      s.a = Math.max(0.1, Math.min(0.8, s.a))
      ctx.beginPath()
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(160,230,210,${s.a})`
      ctx.fill()
    })
    animFrameBg = requestAnimationFrame(draw)
  }
  draw()
}

// --- GLOBE ---
function latlngToXYZ(lat, lng) {
  const phi = (90 - lat) * Math.PI / 180
  const theta = (lng + 180) * Math.PI / 180
  return {
    x: -Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta)
  }
}

function project(x, y, z, R, CX, CY) {
  const ca = Math.cos(rot), sa = Math.sin(rot)
  const rx = x * ca - z * sa
  const rz = x * sa + z * ca
  return { px: CX + rx * R, py: CY - y * R, visible: rz > 0 }
}

const continents = [
  // North America
  [[70,-140],[72,-100],[70,-80],[60,-65],[50,-55],[45,-60],[40,-65],[25,-80],[20,-87],[15,-85],[10,-83],[8,-77],[9,-79],[15,-92],[22,-105],[30,-110],[32,-117],[38,-122],[48,-124],[55,-130],[60,-140],[65,-168],[68,-166],[70,-140]],
  // Greenland
  [[60,-45],[65,-55],[70,-52],[76,-60],[83,-30],[80,-20],[75,-18],[70,-22],[65,-37],[60,-45]],
  // South America
  [[10,-75],[12,-71],[10,-62],[8,-60],[5,-52],[0,-50],[-5,-35],[-10,-37],[-15,-39],[-20,-40],[-23,-43],[-30,-50],[-35,-57],[-42,-63],[-50,-68],[-55,-64],[-55,-67],[-45,-65],[-40,-62],[-30,-50],[-20,-40],[-10,-75],[0,-78],[5,-77],[10,-75]],
  // Europe
  [[35,28],[40,26],[38,23],[37,22],[38,15],[44,8],[44,1],[48,-5],[51,-10],[54,-8],[58,-5],[58,5],[55,10],[54,18],[54,22],[56,24],[59,24],[60,22],[65,14],[70,26],[71,28],[68,30],[65,25],[60,30],[55,22],[50,30],[45,30],[42,28],[38,28],[35,28]],
  // Africa
  [[37,10],[32,32],[22,37],[12,43],[10,42],[0,42],[-5,40],[-10,38],[-20,35],[-30,30],[-34,26],[-30,17],[-20,13],[-15,12],[-5,10],[0,8],[5,2],[4,-3],[5,-5],[10,-15],[15,-17],[20,-17],[25,-15],[30,-10],[35,-5],[37,5],[37,10]],
  // Asia
  [[70,30],[72,50],[72,100],[70,140],[65,168],[60,162],[55,160],[50,140],[45,135],[40,130],[35,136],[32,130],[25,122],[20,110],[10,104],[0,104],[-5,105],[5,100],[10,98],[15,100],[20,93],[25,88],[20,73],[10,77],[8,77],[10,76],[20,73],[25,68],[25,57],[22,59],[20,58],[15,42],[10,44],[12,43],[22,37],[32,32],[37,10],[38,28],[45,30],[50,30],[55,22],[60,30],[65,25],[68,30],[71,28],[70,26],[65,14],[70,14],[72,14],[74,60],[70,30]],
  // Australia
  [[-16,136],[-14,130],[-15,124],[-22,114],[-30,115],[-35,117],[-38,140],[-38,146],[-35,150],[-28,154],[-22,150],[-14,136],[-16,136]],
  // Antarctica
  [[-70,-180],[-70,180],[-75,150],[-80,80],[-82,0],[-80,-60],[-75,-120],[-70,-180]],
]

const landmarkDots = [
  [43.6,-79.4],[48.8,2.3],[51.5,-0.1],[40.7,-74],[35.7,139.7],
  [-33.9,151.2],[28.6,77.2],[41.9,12.5],[30.0,31.2],[-22.9,-43.2],[55.7,37.6]
]

function initGlobe() {
  const canvas = globeCanvas.value
  const g = canvas.getContext('2d')
  const W = 300, H = 300, R = 146, CX = 150, CY = 150

  function draw() {
    g.clearRect(0, 0, W, H)

    // ocean
    const oceanGrad = g.createRadialGradient(CX - 30, CY - 30, 10, CX, CY, R)
    oceanGrad.addColorStop(0, '#1a6080')
    oceanGrad.addColorStop(1, '#071e30')
    g.beginPath()
    g.arc(CX, CY, R, 0, Math.PI * 2)
    g.fillStyle = oceanGrad
    g.fill()

    // grid
    g.strokeStyle = 'rgba(100,200,180,0.07)'
    g.lineWidth = 0.5
    for (let lat = -60; lat <= 60; lat += 30) {
      g.beginPath()
      let first = true
      for (let lng = -180; lng <= 180; lng += 4) {
        const { x, y, z } = latlngToXYZ(lat, lng)
        const p = project(x, y, z, R, CX, CY)
        if (!p.visible) { first = true; continue }
        first ? g.moveTo(p.px, p.py) : g.lineTo(p.px, p.py)
        first = false
      }
      g.stroke()
    }
    for (let lng = -150; lng <= 180; lng += 30) {
      g.beginPath()
      let first = true
      for (let lat = -85; lat <= 85; lat += 4) {
        const { x, y, z } = latlngToXYZ(lat, lng)
        const p = project(x, y, z, R, CX, CY)
        if (!p.visible) { first = true; continue }
        first ? g.moveTo(p.px, p.py) : g.lineTo(p.px, p.py)
        first = false
      }
      g.stroke()
    }

    // continents
    g.save()
    g.beginPath()
    g.arc(CX, CY, R, 0, Math.PI * 2)
    g.clip()

    continents.forEach(poly => {
      const pts = poly.map(([lat, lng]) => {
        const { x, y, z } = latlngToXYZ(lat, lng)
        return project(x, y, z, R, CX, CY)
      })
      const vis = pts.filter(p => p.visible).length
      if (vis < 2) return
      g.beginPath()
      let started = false
      pts.forEach(p => {
        if (!p.visible) { started = false; return }
        if (!started) { g.moveTo(p.px, p.py); started = true }
        else g.lineTo(p.px, p.py)
      })
      g.closePath()
      g.fillStyle = '#4a8f3f'
      g.fill()
      g.strokeStyle = 'rgba(180,230,150,0.4)'
      g.lineWidth = 0.8
      g.stroke()
    })
    g.restore()

    // shine
    const shine = g.createRadialGradient(CX - 50, CY - 50, 5, CX - 30, CY - 30, R * 0.8)
    shine.addColorStop(0, 'rgba(255,255,255,0.12)')
    shine.addColorStop(0.5, 'rgba(255,255,255,0.02)')
    shine.addColorStop(1, 'rgba(0,0,0,0.25)')
    g.beginPath()
    g.arc(CX, CY, R, 0, Math.PI * 2)
    g.fillStyle = shine
    g.fill()

    // landmark dots
    landmarkDots.forEach(([lat, lng]) => {
      const { x, y, z } = latlngToXYZ(lat, lng)
      const p = project(x, y, z, R, CX, CY)
      if (!p.visible) return
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003 + lat)
      g.beginPath()
      g.arc(p.px, p.py, 2.5, 0, Math.PI * 2)
      g.fillStyle = `rgba(100,255,180,${0.7 + 0.3 * pulse})`
      g.fill()
      g.beginPath()
      g.arc(p.px, p.py, 5, 0, Math.PI * 2)
      g.strokeStyle = `rgba(100,255,180,${0.3 * pulse})`
      g.lineWidth = 1
      g.stroke()
    })

    // border
    g.beginPath()
    g.arc(CX, CY, R, 0, Math.PI * 2)
    g.strokeStyle = 'rgba(29,158,117,0.4)'
    g.lineWidth = 1.5
    g.stroke()

    rot += 0.004
    animFrameGlobe = requestAnimationFrame(draw)
  }
  draw()
}
</script>

<template>
  <div class="home">
<canvas ref="bgCanvas" class="bg-canvas"></canvas>
    <!-- HERO -->
    <div class="hero">
      

      <div class="hero-inner">
        <div class="globe-wrap">
          <canvas ref="globeCanvas" width="300" height="300" class="globe-canvas"></canvas>
          <img src="/images/tourcat-removebg.png" alt="TourCat" class="logo-img" />
        </div>

        <div class="hero-text">
          <h1>TourCat</h1>
          <p class="subtitle">Discover and explore iconic landmarks around the world.</p>

          <div class="favourites-dropdown">
            <button class="fav-toggle" @click="showFavourites = !showFavourites">
              Your Favourites
              <span class="dropdown-arrow">{{ showFavourites ? '▲' : '▼' }}</span>
              : {{ favouriteLandmarks.length }}
            </button>
            <ul v-if="showFavourites" class="fav-list">
              <li v-if="favouriteLandmarks.length === 0" class="fav-empty">No favourites yet</li>
              <li v-for="landmark in favouriteLandmarks" v-else :key="landmark.id" class="fav-item">
                {{ landmark.name }}
              </li>
            </ul>
          </div>

          <RouterLink to="/landmarks" class="cta-btn">Explore Landmarks →</RouterLink>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-section">
      <p v-if="loading" style="color:#777; text-align:center;">Loading stats...</p>
      <p v-else-if="error" style="color:red; text-align:center;">{{ error }}</p>
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
  min-height: 100vh;
}

/* HERO */
.hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #071520;
}

.bg-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
}

.hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  padding: 40px 24px;
  flex-wrap: wrap;
}

/* GLOBE */
.globe-wrap {
  position: relative;
  width: 300px;
  height: 300px;
  flex-shrink: 0;
}

.globe-canvas {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(29,158,117,0.4), 0 0 120px rgba(29,158,117,0.15);
}

.logo-img {
  position: absolute;
  bottom: -28px;
  right: -28px;
  width: 130px;
  height: 130px;
  object-fit: contain;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.7));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* HERO TEXT */
.hero-text {
  text-align: left;
  max-width: 340px;
}

.hero-text h1 {
  font-size: 52px;
  font-weight: 500;
  color: #e0f7f0;
  letter-spacing: 3px;
  line-height: 1.1;
  text-shadow: 0 0 40px rgba(29,158,117,0.5);
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: #6dcfbc;
  letter-spacing: 1px;
  margin-bottom: 28px;
  line-height: 1.6;
}

/* FAVOURITES */
.favourites-dropdown {
  margin-bottom: 28px;
}

.fav-toggle {
  background: none;
  border: none;
  font-size: 16px;
  color: #7ecfc0;
  cursor: pointer;
  padding: 0;
  font: inherit;
  letter-spacing: 0.5px;
}

.dropdown-arrow {
  font-size: 12px;
}

.fav-list {
  list-style: none;
  margin: 10px 0 0;
  padding: 12px 16px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(29,158,117,0.3);
  border-radius: 10px;
  text-align: left;
}

.fav-item {
  padding: 4px 0;
  color: #c0ede3;
  font-size: 14px;
}

.fav-empty {
  color: #6dcfbc;
  font-size: 14px;
}

/* CTA */
.cta-btn {
  display: inline-block;
  padding: 13px 32px;
  background: rgba(29,158,117,0.18);
  border: 1px solid rgba(29,158,117,0.55);
  border-radius: 30px;
  color: #a8edd8;
  font-size: 15px;
  text-decoration: none;
  letter-spacing: 1px;
  transition: background 0.3s, border-color 0.3s;
}

.cta-btn:hover {
  background: rgba(29,158,117,0.38);
  border-color: rgba(29,158,117,0.9);
}

/* STATS */
.stats-section {
  width: 100%;
  max-width: 1100px;
  padding: 40px 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
   background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.stat-card h2 {
  margin: 0 0 0.4rem 0;
  font-size: 2rem;
  color: #444;
}

.stat-card p {
  margin: 0;
  color: #777;
}

.chart-section {
  width: 100%;
}

.chart-section h2 {
  margin-bottom: 1rem;
  text-align: center;
  color: #444;
}
</style>