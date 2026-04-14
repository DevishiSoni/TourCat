// Business logic
// Dtaabse quesries
// Data processing
// Logic rules
// Do the actual work

// Imports
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Placement in file system
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataPath = path.join(__dirname, '../data/landmarks.json')

// Get all landmarks and get all landmarks filtered
export const getAllLandmarks = async (filters = {}) => {
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    const json = JSON.parse(data || '{}')

    let landmarks = json.landmarks || []

    // Filter by city
    if(filters.city){
        landmarks = landmarks.filter(l => l.city?.toLowerCase() === filters.city.toLowerCase())
    }

    // Filter by type
    if(filters.type){
        landmarks = landmarks.filter(l => l.type?.toLowerCase() === filters.type.toLowerCase())
    }

    // Filter by country
    if(filters.country){
        landmarks = landmarks.filter(l => l.country?.toLowerCase() === filters.country.toLowerCase())
    }

    return landmarks
}

// Get one landmark by id
export const getLandmarkById = async (id) => {
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    const json = JSON.parse(data)
    let landmarks = json.landmarks || []
    const landmarkId = parseInt(id)
    return landmarks.find(l => l.id === landmarkId)
}

// Create a new landmark
export const createLandmark = async (newLandmark) => {
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    const json = JSON.parse(data) // convert data from JSON to object


    let landmarks = json.landmarks || []
    // Create new ID (last ID + 1 or 1 if landmarks is empty)
    const newID = landmarks.length ? Math.max(...landmarks.map(l => l.id)) + 1 : 1
    // Build landmark object
    const landmarkToAdd = {
        id: newID,
        ...newLandmark
    }
    // Adds to list
    landmarks.push(landmarkToAdd)
    // Pushes to file

    json.landmarks = landmarks
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))
    return landmarkToAdd
}

// Update an existing landmark
export const updateLandmark = async (id, updatedData) => {
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    const json = JSON.parse(data) // convert data from JSON to object

    const landmarkId = parseInt(id)
    let landmarks = json.landmarks || []
    const index = landmarks.findIndex(l => l.id === landmarkId)

    if (index === -1){
        return null //can't find
    }

    // update
    landmarks[index] = {...landmarks[index], ...updatedData}

    json.landmarks = landmarks
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))

    return landmarks[index]
}

// Delete an existing landmark
export const deleteLandmark = async (id) => {
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    const json = JSON.parse(data) // convert data from JSON to object

    let landmarks = json.landmarks || []
    const landmarkId = parseInt(id)
    const index = landmarks.findIndex(l => l.id === landmarkId)

    if (index === -1){
        return null //can't find
    }

    // remove landmark
    const deletedLandmark = landmarks.splice(index, 1)
    json.landmarks = landmarks
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))

    return deletedLandmark[0]
}

// Favourites system (PATCH)
export const updateFavourite = async (id) => {
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    const json = JSON.parse(data) // convert data from JSON to object

    let landmarks = json.landmarks || []
    const landmarkId = parseInt(id)
    const landmark = landmarks.find(l => l.id === landmarkId)

    if (!landmark){
        return null //can't find
    }

    // Flip
    landmark.favourite = !landmark.favourite

    // Write update to file
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))

    return landmark
}