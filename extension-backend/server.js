import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cors from 'cors';

const app = express()

app.use(cors())
app.use(express.json({ limit: "10mb" }))

app.post("/get-ats", async (req, res) => {
    try {
        const result = {
            ats: "70%",
            missingKeywords: ["python"],
            matchingKeywords: ["react", "js", "express"],
            suggestion: "Add more details on your project"
        }
        res.status(200).json({ message: "ok", data: result })
    } catch (err) {
        console.log(err, 'post in server')
        res.status(500).json({ Message: err })
    }
})

app.listen(4000, () => {
    console.log('server is running on 4000')
})