// Contoller and director
// Defines API endpoints, connects URLs to controller functions.
// Depends on landmarkServices.js

// Imports
import express from 'express' // Express
import * as landmarkServices from '../services/landmarkServices.js' // connects with landmarksServices.js

// Initialize Express router for communication
const router = express.Router()

// Get all landmarks with/without filtering
router.get('/', async (req, res) => {
    try {
        // Get filters from request (user)
        const filters = req.query
        // Wait for landmarkServices.js to complete with this information
        const data = await landmarkServices.getAllLandmarks(filters)
        // If unsuccessful
        if(!data){
            return res.status(404).json({ error: `Landmark(s) not found.)`})
        }
        // If successful, respond with the created landmark
        res.json(data)
    }
    // If there is an error
    catch (err) {
        res.status(500).json({ error: 'Failed to get landmarks.' })
    }
})

// Get one landmark by its ID
router.get('/:id', async (req, res) => {
    try {
        // Get landmark ID from request parameters
        const id = req.params.id
        // Wait for landmarkServices.js to complete with this information
        const landmark = await landmarkServices.getLandmarkById(id)
        // If unsuccessful
        if (!landmark){
            return res.status(404).json({ error: `Landmark with Id ${id} not found.`})
        }
        // If successful, respond with the created landmark
        res.json(landmark)
    }
    // If there is an error
    catch (err) {
        res.status(500).json({ error: 'Server error, landmark for found.' })
    }
})

// Create a new landmark
router.post('/', async (req, res) => {
    try {
        // Get landmark information from request
        const newLandmark = req.body
        // Wait for landmarkServices.js to complete with this information
        const created = await landmarkServices.createLandmark(newLandmark)
        // If unsuccessful
        if(!created){
            return res.status(404).json({ error: `Landmark could not be created.`})
        }
        // If successful, respond with the created landmark
        res.status(201).json(created)
    }
    // If there is an error
    catch (err) {
        res.status(500).json({ error: 'Failed to create landmark.' })
    }
})

// Update an existing landmark, find by ID
router.put('/:id', async (req, res) => {
    try {
        // Get landmark ID from request parameters
        const id = req.params.id
        // Get updated information aboyt landmark
        const updatedData = req.body
        // Wait for landmarkServices.js to complete with this information
        const updated = await landmarkServices.updateLandmark(id, updatedData)

        // If unsuccessful
        if(!updated){
            return res.status(404).json({ error: 'Landmark not found.'})
        }

        // If successful, return updated object
        res.json(updated)
    }
    // If there is an error
    catch (err) {
        res.status(500).json({ error: 'Failed to update landmark.' })
    }
})

// Delete an existing landmark, find by ID
router.delete('/:id', async (req, res) => {
    try{
        // Get landmark ID from request parameters
        const id = req.params.id
        // Wait for landmarkServices.js to complete with this information
        const deleted = await landmarkServices.deleteLandmark(id)
        
        // If unsuccessful
        if(!deleted){
            return res.status(404).json({ error: 'Landmark not found.'})
        }

        // If successful, relay the message
        res.json({ message: 'Landmark deleted.'})
    }
    // If there is an error
    catch (err) {
        res.status(500).json({ error: 'Failed to delete landmark.' })
    }
})

// Favourite system
router.patch('/:id/favourite', async (req, res) => {
    try {
        // Get landmark ID from request parameters
        const id = req.params.id
        // Wait for landmarkServices.js to complete with this information
        const updatedFavourite = await landmarkServices.updateFavourite(id)

        // If unsuccessful
        if(!updatedFavourite){
            return res.status(404).json({ error: 'Landmark not found.'})
        }

        // If successful, return favourited landmark
        res.json(updatedFavourite)
    }
    // If there is an error
    catch (err) {
        res.status(500).json({ error: 'Failed to update landmark favourite.' })
    }
})

// Export the router
export default router