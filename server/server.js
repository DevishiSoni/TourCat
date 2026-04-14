// Main backend starter
// Starts Express server
// Sets up middleware
// Connect routes
// Chooses port
// Turns backend on and brings everything together

// Imports
import express from "express"
import path from 'path'
import cors from "cors"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))

// Testing the server
app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working" });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})