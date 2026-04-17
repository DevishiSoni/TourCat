// Main backend starter/base server
// Starts Express server
// Sets up middleware
// Connect routes
// Chooses port
// Turns backend on and brings everything together

// Imports
import express from 'express' // routes, server
import path from 'path' // build safe file paths
import cors from 'cors'
import process from 'process' // access to environment variables
import fs from 'fs' // reads files from computer
import { fileURLToPath } from 'url' // ES module limitation fix

// Connects landmarks.js to landmarksServices.js
import landmarksRoutes from './routes/landmarks.js'

// Placement in file system
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create the Express application
const app = express() // create backend server
app.set('port', process.env.PORT || 3000) // use environment variable from command line or 3000
app.use(cors()) // allows frontend and backend on different ports (middleware)
app.use(express.json()) // allows reading json in requests (middleware)

// Initialize port
const PORT = app.get('port')

// Serve Vue build files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'dist')))

// Initialize file paths/mount routes
app.use('/api/landmarks', landmarksRoutes)

// Testing the server (health check endpoint)
app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working" });
})

// For any route, just send index.html so that Vue Router handles (fallback)
app.get(/.*/, (req, res) => {
  //res.sendFile(path.join(__dirname, 'dist', 'index.html')) original (doesnt route properly)
  //res.sendFile(path.join(__dirname, '..','client','index.html')) //correct routing for dev server (NOT DIST)
  res.sendFile(path.join(__dirname, '..','client','dist','index.html'))
})

// Start server
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
})