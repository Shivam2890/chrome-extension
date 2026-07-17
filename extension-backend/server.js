import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cors from 'cors';
import { PDFParse } from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import OpenAI from "openai";


const app = express()

app.use(cors())
app.use(express.json({ limit: "10mb" }))

// i want resume and text(jd)
app.post("/get-ats", async (req, res) => {
    // const result = {
    //     ats: "70%",
    //     missingKeywords: ["python"],
    //     matchingKeywords: ["react", "js", "express"],
    //     suggestion: "Add more details on your project"
    // }

    //convert base64 data into buffer that means pdf data into binary format
    const base64 = req.body.resumeInBase64.split(",")[1] // resume only 
    const dataInBuffer = Buffer.from(base64, 'base64')

    //convert buffer into text format using npm pdf-parse
    const parser = new PDFParse({ data: dataInBuffer })
    const pdfActualText = await parser.getText() //resume
    const jd = req.body.jd // jd


    // console.log(jd, pdfActualText.text, 'pdf actual text')

    //call gemini and get the response
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    try {
          
        const client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });

        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: `
//             Compare the following resume with the given job description.

//             RESUME:
//             ${pdfActualText.text}

//             JOB DESCRIPTION:
//             ${jd}

//             Analyze how well the resume matches the job description.

//             Return ONLY valid JSON in exactly this structure:

//             {
//                 "ats": "70%",
//                 "missingKeywords": ["python"],
//                 "matchingKeywords": ["react", "javascript", "express"],
//                 "suggestion": "Add more details about projects and include the missing skills relevant to the job description."
//             }

//             Rules:
//             - ats must represent the resume match percentage against the job description.
//             - missingKeywords must contain important skills or keywords present in the job description but missing from the resume.
//             - matchingKeywords must contain important skills or keywords found in both the resume and job description.
//             - suggestion must give a short, practical improvement suggestion.
//             - Do not include markdown.
//             - Do not include explanations outside the JSON object.
//             `,
        });
        console.log(response.output_text);

        res.status(200).json({ message: "ok", data: response.output_text })
    }
    catch (err) {
        console.log(err, 'post in server')
        res.status(500).json({ Message: err.message || err })
    }
})

app.listen(4000, () => {
    console.log('server is running on 4000')
})