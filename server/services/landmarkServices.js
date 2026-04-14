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

// Get all landmarks
export const getAllLandmarks = async () => {
    const data = await fs.promises.readFile(dataPath, 'utf8')
    const json = JSON.parse(data)
    return json.landmarks
}

// Get one landmark by id
export const getLandmarkById = async (id) => {
    const data = await fs.promises.readFile(dataPath, 'utf8')
    const json = JSON.parse(data)
    return json.landmarks.find(l => l.id === parseInt(id))
}

// createLandmark()

// updateLandmark()

// deleteLandmark()