// Traffic director
//Deinfes API endpoints
// Connect URLs to controller functions
// Node.js Router stuff
// API URL HANDLER
// REST API endpints

// Imports
import express from 'express'
import * as landmarkServices from '../services/landmarkServices.js'

// Initialize Express router
// Ask serviceLandmarks.js and send it back
const router = express.Router()

// GET all landmarks
router.get('/', async (req, res) => {
    try {
        const data = await landmarkServices.getAllLandmarks()
        res.json(data)
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get all landmarks'})
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

// Export the router
export default router


// POST (create)


// PUT (update)


// DELETE (delete)