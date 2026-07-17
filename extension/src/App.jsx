import React, { useState, useEffect } from 'react'

const App = () => {
  const [resumeName, setResumeName] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    // Load existing resume name on mount
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["resume"], (result) => {
        if (result && result.resume && result.resume.name) {
          setResumeName(result.resume.name)
        }
      })
    }
  }, [])

  function getResume(e) {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    
    if (file.type !== 'application/pdf') {
      setStatusMsg('Please select a PDF file.')
      return
    }

    const reader = new FileReader()
    reader.onload = function (event) {
      const pdfIntoString = event.target.result

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ resume: { name: file.name, content: pdfIntoString } }, () => {
          setResumeName(file.name)
          setStatusMsg('Resume uploaded successfully!')
          setTimeout(() => setStatusMsg(''), 3000)
        })
      } else {
        // Fallback for development/non-extension context
        setResumeName(file.name)
        setStatusMsg('Resume saved locally (dev mode)!')
        setTimeout(() => setStatusMsg(''), 3000)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="w-[380px] min-h-[220px] bg-slate-950 text-slate-100 p-5 font-sans flex flex-col justify-between border border-slate-800 shadow-2xl overflow-hidden rounded-lg">
      <div>
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            AI Resume Analyzer
          </h1>
        </div>
        
        {/* Subtitle / Description */}
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Upload your PDF resume here. Then select job description text on any webpage, click the button to analyze and get your ATS match.
        </p>

        {/* Current File Display */}
        {resumeName ? (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center justify-between transition-all duration-300">
            <div className="flex items-center space-x-2 truncate">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="text-xs font-medium text-emerald-300 truncate" title={resumeName}>
                {resumeName}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              Active
            </span>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-slate-900 border border-dashed border-slate-700 rounded-lg flex items-center justify-center">
            <span className="text-xs text-slate-500 font-medium">No resume uploaded yet</span>
          </div>
        )}
      </div>

      {/* File Upload Button */}
      <div className="relative mt-2">
        <label className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 shadow-lg shadow-teal-900/20 border border-emerald-500/30 text-center select-none active:scale-[0.98]">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          {resumeName ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
          <input 
            type="file" 
            accept="application/pdf" 
            name="Resume" 
            className="hidden" 
            onChange={getResume} 
          />
        </label>

        {statusMsg && (
          <p className="text-[11px] text-emerald-400 text-center mt-2 animate-fade-in font-medium">
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  )
}

export default App