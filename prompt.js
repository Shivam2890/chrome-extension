// import { jd, pdfActualText } from './extension-backend/server.js';
// console.log(json,pdfActualText, 'text')

// export const prompt = `
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
//             `




