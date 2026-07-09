import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cors from 'cors';
import { PDFParse } from 'pdf-parse';

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

        //convert base64 data into buffer that means pdf data into binary format
        const base64 = req.body.resumeInBase64.split(",")[1]
        const dataInBuffer = Buffer.from(base64, 'base64')

        //convert buffer into text format using npm pdf-parse
        const parser = new PDFParse({ data: dataInBuffer })
        const pdfActualText = await parser.getText()

        console.log(pdfActualText, 'pdf actual text')

        //call gemini and get the response
        

        res.status(200).json({ message: "ok", data: result })
    } catch (err) {
        console.log(err, 'post in server')
        res.status(500).json({ Message: err })
    }
})

app.listen(4000, () => {
    console.log('server is running on 4000')
})