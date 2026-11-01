// console.log('backgorun is running')

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === `SELECTED_TEXT`) {
//         handleSelectedText(message, sendResponse)
//         return true
//     }
// })

// async function handleSelectedText(message, sendResponse) {
//     try {
//         const storage = await chrome.storage.local.get(["resume"])
//         if (!storage || !storage.resume) {
//             sendResponse("No resume uploaded")
//             return
//         }
//         await callApi({ resume: storage.resume, jd: message.payload.jd }, sendResponse)
//     } catch (err) {
//         console.log(err, 'error in handleSelectedText')
//         sendResponse("something went wrong")
//     }
// }

// async function callApi(message, sendResponse) {
//     // console.log(message, 'data coming from content to bakcground') // resume and jd
//     const body = {
//         resumeInBase64: message.resume.content,
//         jd: message.jd
//     }
//     fetch(`http://localhost:4000/get-ats`,
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(body) // resumeinBase64 and jd
//         })
//         .then((response) => {
//             return response.json()
//         })
//         .then((res) => {
//             let responseData = res.data;
//             console.log(responseData, 'first resopnose dat')
//             if (responseData) {
//                 // Remove markdown backticks if returned by the LLM
//                 responseData = responseData.replace(/```json/i, '').replace(/```/, '').trim();
//             }
//             const parsedData = JSON.parse(responseData);
//             console.log(parsedData.ats, 'data response')
//             sendResponse(parsedData.ats)
//         })
//         .catch(err => {
//             console.log(err, 'err while fetching')
//             sendResponse("something went wrong")
//         })
// }

console.log('background is running')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SELECTED_TEXT") {
        handleSelectedText(message, sendResponse)
        return true // keep the message channel open for async response
    }
})

async function handleSelectedText(message, sendResponse) {
    try {
        const storage = await chrome.storage.local.get(["resume"])
        if (!storage || !storage.resume) {
            sendResponse("No resume uploaded")
            return
        }
        await callApi({ resume: storage.resume, jd: message.payload.jd }, sendResponse)
    } catch (err) {
        console.log(err, 'error in handleSelectedText')
        sendResponse("something went wrong")
    }
}

async function callApi(message, sendResponse) {
    const body = {
        resumeInBase64: message.resume.content,
        jd: message.jd
    }

    return fetch(`http://localhost:4000/get-ats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`)
            }
            return response.json()
        })
        .then((res) => {
            let responseData = res.data
            console.log(responseData, 'raw response data')

            if (!responseData) {
                sendResponse("No data returned from server")
                return
            }

            responseData = responseData.replace(/```json/i, '').replace(/```/, '').trim()

            const parsedData = JSON.parse(responseData)

            if (!parsedData || !parsedData.ats) {
                sendResponse("Could not parse ATS result")
                return
            }

            console.log(parsedData.ats, 'ats result')
            sendResponse(parsedData.ats)
        })
        .catch(err => {
            console.log(err, 'err while fetching')
            sendResponse("something went wrong")
        })
}