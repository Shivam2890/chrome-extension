console.log("content.js is working")

document.addEventListener('mouseup', (e) => {
    const selectText = window.getSelection().toString().trim()

    if (e.target.id == "btn") {
        return
    }

    if (selectText.length > 15) {
        createButton(selectText)
    } else {
        if (btn) {
            btn.remove()
            btn = null
        }
    }
})

let btn = null
function createButton(selectText) {
    if (btn) {
        btn.remove()
    }
    btn = document.createElement('button')
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
    document.body.appendChild(btn)
}

async function sendTextToBackground(text) {
    btn.innerText = '⏳ Analyzing...'
    btn.disabled = true

    chrome.runtime.sendMessage(
        {
            type: `SELECTED_TEXT`,
            payload: { jd: text }
        },
        (response) => {
            console.log(response, 'response from background.js')

            if (btn) {
                if (response === "No resume uploaded") {
                    btn.textContent = "❌ Please upload resume first!"
                    btn.style.backgroundColor = '#ef4444' // red-500
                    btn.style.borderColor = '#dc2626'
                } else if (response === "something went wrong" || response === "parsing error") {
                    btn.textContent = "❌ Error analyzing resume"
                    btn.style.backgroundColor = '#ef4444' // red-500
                    btn.style.borderColor = '#dc2626'
                } else {
                    btn.textContent = `ATS Score: ${response}`
                    btn.style.backgroundColor = '#10b981' // emerald-500
                    btn.style.borderColor = '#059669'
                }
                btn.style.color = '#ffffff'
                btn.disabled = false

                setTimeout(() => {
                    if (btn) {
                        btn.remove()
                        btn = null
                    }
                }, 4000)
            }
        }
    )
}