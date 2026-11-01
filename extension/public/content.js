// console.log("content.js is working")

// document.addEventListener('mouseup', (e) => {
//     const selectText = window.getSelection().toString().trim()

//     if (e.target.id == "btn") {
//         return
//     }

//     if (selectText.length > 15) {
//         createButton(selectText)
//     } else {
//         if (btn) {
//             btn.remove()
//             btn = null
//         }
//     }
// })

// let btn = null
// function createButton(selectText) {
//     if (btn) {
//         btn.remove()
//     }
//     btn = document.createElement('button')
//     btn.id = "btn"
//     btn.innerText = '✨ Analyze Resume'
//     btn.style.position = 'fixed'
//     btn.style.top = '120px'
//     btn.style.right = '40px'
//     btn.style.backgroundColor = '#0f172a' // slate-900
//     btn.style.color = '#34d399' // emerald-400
//     btn.style.border = '1px solid #10b981' // emerald-500
//     btn.style.borderRadius = '8px'
//     btn.style.padding = '8px 16px'
//     btn.style.fontSize = '13px'
//     btn.style.fontWeight = '600'
//     btn.style.fontFamily = 'system-ui, -apple-system, sans-serif'
//     btn.style.cursor = 'pointer'
//     btn.style.zIndex = '999999'
//     btn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)'
//     btn.style.transition = 'all 0.2s ease-in-out'

//     // Hover effect
//     btn.addEventListener('mouseenter', () => {
//         btn.style.backgroundColor = '#10b981'
//         btn.style.color = '#ffffff'
//     })
//     btn.addEventListener('mouseleave', () => {
//         btn.style.backgroundColor = '#0f172a'
//         btn.style.color = '#34d399'
//     })

//     console.log(btn, 'btn')
//     btn.addEventListener('click', () => sendTextToBackground(selectText))
//     document.body.appendChild(btn)
// }

// async function sendTextToBackground(text) {
//     btn.innerText = '⏳ Analyzing...'
//     btn.disabled = true

// chrome.runtime.sendMessage(
//   {
//     type: "SELECTED_TEXT",
//     payload: { jd: text }
//   },
//   (response) => {
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message);
//       return;
//     }

//     console.log(response);
//             if (btn) {
//                 if (response === "No resume uploaded") {
//                     btn.textContent = "❌ Please upload resume first!"
//                     btn.style.backgroundColor = '#ef4444' // red-500
//                     btn.style.borderColor = '#dc2626'
//                 } else if (response === "something went wrong" || response === "parsing error") {
//                     btn.textContent = "❌ Error analyzing resume"
//                     btn.style.backgroundColor = '#ef4444' // red-500
//                     btn.style.borderColor = '#dc2626'
//                 } else {
//                     btn.textContent = `ATS Score: ${response}`
//                     btn.style.backgroundColor = '#10b981' // emerald-500
//                     btn.style.borderColor = '#059669'
//                 }
//                 btn.style.color = '#ffffff'
//                 btn.disabled = false

//                 setTimeout(() => {
//                     if (btn) {
//                         btn.remove()
//                         btn = null
//                     }
//                 }, 4000)
//             }
//         }
//     )
// }

console.log("content.js is working")

let btn = null

document.addEventListener('mouseup', (e) => {
    const selectText = window.getSelection().toString().trim()

    if (e.target.id == "btn") {
        return
    }

    if (selectText.length > 15) {
        createButton(selectText)
    } else { //text is shorter
        if (btn) {
            btn.remove()
            btn = null
        }
    }
})

function createButton(selectText) {
    if (btn) {
        btn.remove()
    }

    btn = document.createElement('button') //only creates the element in memory
    btn.id = "btn"
    btn.innerText = '✨ Analyze Resume'
    btn.style.position = 'fixed'
    btn.style.top = '120px'
    btn.style.right = '40px'
    btn.style.backgroundColor = '#0f172a' // slate-900
    btn.style.color = '#34d399' // emerald-400
    btn.style.border = '1px solid #10b981' // emerald-500
    btn.style.borderRadius = '8px'
    btn.style.padding = '8px 16px'
    btn.style.fontSize = '13px'
    btn.style.fontWeight = '600'
    btn.style.fontFamily = 'system-ui, -apple-system, sans-serif'
    btn.style.cursor = 'pointer'
    btn.style.zIndex = '999999'
    btn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)'
    btn.style.transition = 'all 0.2s ease-in-out'

    // Hover effect
    btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#10b981'
        btn.style.color = '#ffffff'
    })
    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '#0f172a'
        btn.style.color = '#34d399'
    })

    console.log(btn, 'btn')
    btn.addEventListener('click', () => sendTextToBackground(selectText))
    document.body.appendChild(btn) //inserts it into the webpage's DOM
}

async function sendTextToBackground(text) {
    // Snapshot the button this specific click belongs to.
    // Prevents a later async response from mutating a *different*
    // button if the user selects new text before this one resolves.
    const thisBtn = btn
    thisBtn.innerText = '⏳ Analyzing...'
    thisBtn.disabled = true //prevent to click repatively

    chrome.runtime.sendMessage(
        {
            type: "SELECTED_TEXT",
            payload: { jd: text }
        },
        (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message, 'error getting in content form the background.js chorme.runtime.sendMessage')

                if (thisBtn.isConnected) { //isConnected is the DOM property which give me true or false
                    thisBtn.textContent = "❌ Extension error, try again"
                    thisBtn.style.backgroundColor = '#ef4444' // red-500
                    thisBtn.style.borderColor = '#dc2626'
                    thisBtn.style.color = '#ffffff'
                    thisBtn.disabled = false
                    setTimeout(() => {
                        thisBtn.remove()
                        if (btn === thisBtn) btn = null
                    }, 4000)
                }
                return
            }

            // If this button was already removed/replaced by a newer
            // selection, don't resurrect or mutate it.
            if (!thisBtn.isConnected) return

            console.log(response, 'response from the background to content (in content.js)')

            if (response === "No resume uploaded") {
                thisBtn.textContent = "❌ Please upload resume first!"
                thisBtn.style.backgroundColor = '#ef4444' // red-500
                thisBtn.style.borderColor = '#dc2626'
            } else if (
                response === "something went wrong" ||
                response === "Could not parse ATS result" ||
                response === "No data returned from server"
            ) {
                thisBtn.textContent = "❌ Error analyzing resume"
                thisBtn.style.backgroundColor = '#ef4444' // red-500
                thisBtn.style.borderColor = '#dc2626'
            } else {
                thisBtn.textContent = `ATS Score: ${response}`
                thisBtn.style.backgroundColor = '#10b981' // emerald-500
                thisBtn.style.borderColor = '#059669'
            }

            thisBtn.style.color = '#ffffff'
            thisBtn.disabled = false

            setTimeout(() => {
                thisBtn.remove()
                if (btn === thisBtn) btn = null
            }, 4000)
        }
    )
}
