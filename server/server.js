// This file works on the backend and uses express to set up a server

// Imports
import express from "express";
import path from 'path'
import cors from "cors";
import process from 'process'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});