import React from 'react'

const App = () => {

  function getResume(e) {
    const file = e.target.files[0]
    if (!file) {
      alert('upload resume')
      return
    }
    const reader = new FileReader()

    reader.onload = function (e) {
      const pdfIntoString = e.target.result

      chrome.storage.local.set({ resume: { name: file.name, content: pdfIntoString } })
    }

    //here we are reading file data first
    reader.readAsDataURL(file)
  }

  return (
    <div className='w-[400px] h-[200px]'>
      <h1 className='text-bold text-2xl'>Upload Rsume</h1>

      <input type="file" accept='application/pdf' name='Resume' className='border-2 w-20 shadow-2xl'
        onChange={getResume} />
    </div>
  )
}

export default App