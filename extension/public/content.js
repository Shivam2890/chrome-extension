console.log("contendt.js is working")

document.addEventListener('mouseup', (e) => {
    console.log(e, 'event')
    const selectText = window.getSelection().toString().trim()

    console.log(selectText, 'selected text')

    if (selectText.length > 15) {
        createButton(selectText)
    }
})

function createButton(selectText) {
    const btn = document.createElement('button')
    btn.innerText = 'Get Text'
    btn.style.backgroundColor = 'black'
    btn.style.position = 'fixed'
    btn.style.color = 'white'
    btn.style.padding = '5px'
    btn.style.zIndex = 999
    btn.style.top = '100px'
    btn.style.right = '30px'

    console.log(btn, 'btn')
    btn.addEventListener('click', () => sendTextToBackground(selectText))
    document.body.appendChild(btn)
}

function sendTextToBackground(text) {
    chrome.runtime.sendMessage(
        {
            type: `SELECTED_TEXT`,
            payload: text
        }
    )
}