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

// Create a new landmark
// Ask serviceLandmarks.js and send it back
router.post('/', async (req, res) => {
    try {
        const newLandmark = req.body // get info from user
        const created = await landmarkServices.createLandmark(newLandmark) // send to landmarksServices.js

        res.status(201).json(created) // succesful code
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create landmark' }) // error
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
            res.status(404).json({ error: 'Landmark not found '}) //  can't find landmark
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
            res.status(404).json({ error: 'Landmark not deleted '}) //  can't find landmark
        }

        res.json({ message: 'Landmark deleted '})
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete landmark' }) // error
    }
})

// Export the router
export default router

// Filtering
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