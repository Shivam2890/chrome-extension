console.log('backgorun is running')

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === `SELECTED_TEXT`) {
        console.log(message.payload, 'payload')


    }
})
