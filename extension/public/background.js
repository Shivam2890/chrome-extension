console.log('backgorun is running')

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === `SELECTED_TEXT`) {
        console.log(message.payload, 'payload')

        callApi(message.payload, sendResponse)

    }
})

async function callApi(message, sendResponse) {
    console.log(message, 'data coming from content to bakcground')
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
            body: JSON.stringify(body)
        })
        .then((data) => data.json())
        .then((res) => {
            console.log(res, 'data resospone')
            sendResponse(res.data.ats)
        })
        .catch(err => {
            console.log(err, 'err while fethcing')
        })


}
