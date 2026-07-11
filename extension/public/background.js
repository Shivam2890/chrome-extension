console.log('backgorun is running')

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === `SELECTED_TEXT`) {
        // console.log(message.payload, 'payload') // resume and jd

        callApi(message.payload, sendResponse)
        // sendResponse("some data coming form the callApi")
        //Keep the message port open untill sendResponse is called
        return true
    }
})

async function callApi(message, sendResponse) {
    // console.log(message, 'data coming from content to bakcground') // resume and jd
    const body = {
        resumeInBase64: message.resume.content,
        jd: message.jd
    }
    fetch(`http://localhost:4000/get-ats`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body) // resumeinBase64 and jd
        })
        .then((data) => {
            data
            console.log(data.data.json(), 'data in json')
            return data.data.json()
        })
        .then((res) => {
            console.log(JSON.parse(res.data).ats, 'data resospone') //this data is comming in json
            sendResponse(JSON.parse(res.data).ats) // data form the ai
        })
        .catch(err => {
            console.log(err, 'err while fethcing')
            sendResponse("something went wrong")
        })
}
