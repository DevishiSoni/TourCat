// server/routes/landmarks.js
// Traffic director
//Deinfes API endpoints
// Connect URLs to controller functions
// Node.js Router stuff
// API URL HANDLER
// REST API endpints

// Imports
import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import * as landmarkServices from '../services/landmarkServices.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Express router
// Ask serviceLandmarks.js and send it back
const router = express.Router()

// Get all landmarks and filtering
router.get('/', async (req, res) => {
    try {
        const filters = req.query
        const data = await landmarkServices.getAllLandmarks(filters)
        res.json(data)
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get landmarks' })
    }
})

// GET one landmark by its ID
// Ask serviceLandmarks.js and send it back
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const landmark = await landmarkServices.getLandmarkById(id)

        if (!landmark){
            return res.status(404).json({ error: 'Landmark with id not found'})
        }
        res.json(landmark)
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})


// Save uploaded images to client/public/images/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../client/public/images/'))  //file path
  },
  filename: (req, file, cb) => {
    const name = file.originalname.replace(/\s+/g, '')
    cb(null, `${Date.now()}-${name}`)
  }
})

const upload = multer({ storage })

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id
        const updatedData = {
            ...req.body,
            yearBuilt: req.body.yearBuilt ? parseInt(req.body.yearBuilt) : null,
            latitude: parseFloat(req.body.latitude),
            longitude: parseFloat(req.body.longitude),
            image: req.file ? `/images/${req.file.filename}` : req.body.image
        }
        const updated = await landmarkServices.updateLandmark(id, updatedData)

        if (!updated) {
            return res.status(404).json({ error: 'Landmark not found' })
        }

        res.json(updated)
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update landmark' })
    }
})
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newLandmark = {
      ...req.body,
      yearBuilt: req.body.yearBuilt ? parseInt(req.body.yearBuilt) : null,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      favourite: false,
      image: req.file ? `/images/${req.file.filename}` : ''
    }
    const created = await landmarkServices.createLandmark(newLandmark)
    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create landmark' })
  }
})
// PUT (update)
// Update an existing landmark, find by ID
// Ask serviceLandmarks.js and send it back
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id // get ID to find specific landmark
        const updatedData = req.body // get info from user
        const updated = await landmarkServices.updateLandmark(id, updatedData) // send to landmarksServices.js

        if(!updated){
            return res.status(404).json({ error: 'Landmark not found '}) //  can't find landmark
        }

        // Return updated object
        res.json(updated)
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update landmark' }) // error
    }
})


// DELETE (delete)
// Delete an existing landmark, find by ID
// Ask serviceLandmarks.js and send it back
router.delete('/:id', async (req, res) => {
    try{
        const id = req.params.id
        const deleted = await landmarkServices.deleteLandmark(id)
        
        if(!deleted){
            return res.status(404).json({ error: 'Landmark not deleted '}) //  can't find landmark
        }

        res.json({ message: 'Landmark deleted '})
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete landmark' }) // error
    }
})

// Favourite system
router.patch('/:id/favourite', async (req, res) => {
    try {
        const id = req.params.id
        const updatedFavourite = await landmarkServices.updateFavourite(id)

        if(!updatedFavourite){
            return res.status(404).json({ error: 'Landmark not found with ID'})
        }

        res.json(updatedFavourite)
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update landmark favourite' })
    }
})

// Export the router
export default router