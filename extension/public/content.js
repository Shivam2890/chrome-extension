console.log("contendt.js is working")

document.addEventListener('mouseup', (e) => {
    console.log(e, 'event')
    const selectText = window.getSelection().toString().trim()

    console.log(selectText, 'selected text')

    if (e.target.id == "btn") {
        return
    }

    if (selectText.length > 15) {
        createButton(selectText)
    }
})

let btn = null
function createButton(selectText) {
    if (btn) {
        btn.remove()
    }
    btn = document.createElement('button')
    btn.id = "btn"
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

async function sendTextToBackground(text) {

    const storage = await chrome.storage.local.get(["resume"])
    console.log(storage, 'complete sotrage')
    // console.log(storage.resume.content, 'content of resume')

    if (!storage.resume) {
        alert('upload resume')
        return
    }

    chrome.runtime.sendMessage(
        {
            type: `SELECTED_TEXT`,
            payload: { resume: storage.resume, jd: text }
        },
        (response) => {
            console.log(response, 'response form backgorund.js')

            btn.textContent = response

            setTimeout(() => {
                btn.remove()
            }, 2000)
        }
    )
}
//  { selectText: text, resume: storage.resume }