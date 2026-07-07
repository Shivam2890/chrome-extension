console.log('backgorun is running')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === `SELECTED_TEXT`) {
        console.log(message.payload, 'payload')
    }
})
