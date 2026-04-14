// Logic and functionality.
// Contrains the logic, database queries, data processing and logic constraints.
// Reports back to landmarks.js

// Imports
import fs from 'fs' // reading files from computer
import path from 'path' // for building safe path files
import { fileURLToPath } from 'url' // ES module limitation fix

// Placement in file system
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Resuable pat to the dataset
const dataPath = path.join(__dirname, '../data/landmarks.json')

// Get all landmarks and get all landmarks with filter(s)
export const getAllLandmarks = async (filters = {}) => {
    // Read file (empty is fallback)
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    // Parse the data into objects
    const json = JSON.parse(data || '{}')
    // Get the landmrks (empty is fallback)
    let landmarks = json.landmarks || []

    // Filter by city (keep only landmarks with tags of that city)
    if(filters.city){
        landmarks = landmarks.filter(l => l.city?.toLowerCase() === filters.city.toLowerCase())
    }

    // Filter by type (keep only landmarks with tags of that type)
    if(filters.type){
        landmarks = landmarks.filter(l => l.type?.toLowerCase() === filters.type.toLowerCase())
    }

    // Filter by country (keep only landmarks with tags of that country)
    if(filters.country){
        landmarks = landmarks.filter(l => l.country?.toLowerCase() === filters.country.toLowerCase())
    }

    // Return the desired landmarks
    return landmarks
}

// Find a landmark by its id
export const getLandmarkById = async (id) => {
    // Read file (empty is fallback)
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    // Parse the data into objects
    const json = JSON.parse(data || '{}')
    // Read landarks (empty is fallback)
    let landmarks = json.landmarks || []
    // Get the landmark ID
    const landmarkId = parseInt(id)
    // Return the landmark with that ID
    const found = landmarks.find(l => l.id === landmarkId)

    // If ID cannot be found
    if(!found){
        return null
    }
    // Return the desired landmark
    return found
}

// Create a new landmark
export const createLandmark = async (newLandmark) => {
    // Read file (empty is fallback)
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    // Parse the data into objects
    const json = JSON.parse(data || '{}')
    // Read landarks (empty is fallback)
    let landmarks = json.landmarks || []
    // Create new ID (last ID + 1 or 1 if 'landmarks' is empty)
    const newID = landmarks.length ? Math.max(...landmarks.map(l => l.id)) + 1 : 1
    // Build landmark object
    const landmarkToAdd = {
        id: newID,
        ...newLandmark
    }
    // Add the new landmark object to 'landmarks'
    landmarks.push(landmarkToAdd)

    // Write to the file to ensure change permanency
    json.landmarks = landmarks
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))
    // Return the new landmark
    return landmarkToAdd
}

// Update an existing landmark
export const updateLandmark = async (id, updatedData) => {
    // Read file (empty is fallback)
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    // Parse the data into objects
    const json = JSON.parse(data || '{}')
    // Get the landmark ID
    const landmarkId = parseInt(id)
    // Read landarks (empty is fallback)
    let landmarks = json.landmarks || []
    // Find the index of the wanted landmark
    const index = landmarks.findIndex(l => l.id === landmarkId)

    // If index cannot be found
    if (index === -1){
        return null
    }

    // Update the found landmark
    landmarks[index] = {...landmarks[index], ...updatedData}

    // Write to new file to ensure change permanency
    json.landmarks = landmarks
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))

    // Return the updated landmark
    return landmarks[index]
}

// Delete an existing landmark
export const deleteLandmark = async (id) => {
    // Read file (empty is fallback)
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    // Parse the data into objects
    const json = JSON.parse(data || '{}')
    // Read landarks (empty is fallback)
    let landmarks = json.landmarks || []
    // Get the landmark ID
    const landmarkId = parseInt(id)
    // Find the index of the wanted landmark
    const index = landmarks.findIndex(l => l.id === landmarkId)

    // If index cannot be found
    if (index === -1){
        return null
    }

    // Remove the landmark (one element at that index)
    const deletedLandmark = landmarks.splice(index, 1)
    // Write to the file to ensure change permanency
    json.landmarks = landmarks
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))

    // Return the ID of the deleted landmark
    return deletedLandmark[0]
}

// Favourites system
export const updateFavourite = async (id) => {
    // Read file (empty is fallback)
    const data = await fs.promises.readFile(dataPath, 'utf8').catch(() => '{}')
    // Parse the data into objects
    const json = JSON.parse(data || '{}')
    // Read landarks (empty is fallback)
    let landmarks = json.landmarks || []
    // Get the landmark ID
    const landmarkId = parseInt(id)
    // Find the landmark based on that ID
    const landmark = landmarks.find(l => l.id === landmarkId)

    // if the landmark cannot be found
    if (!landmark){
        return null
    }

    // If favourited, make unfavourited
    // If unfavourited, make favourited
    landmark.favourite = !landmark.favourite

    // Write to the file to ensure change permanency
    await fs.promises.writeFile(dataPath, JSON.stringify(json, null, 2))

    // Return the landmark
    return landmark
}