import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Success(){
  const { id } = useParams()
  const nav = useNavigate()
  return (
    <div className="max-w-xl mx-auto text-center mt-10">
      <h2 className="text-2xl font-semibold mb-4">Report Submitted</h2>
      <p className="mb-4">Thank you. Your report id is <span className="font-mono">{id}</span>. Authorities will review it.</p>
      <div className="space-x-2">
        <button onClick={()=> nav('/')} className="px-4 py-2 bg-blue-600 text-white rounded">Back to Home</button>
      </div>
    </div>
  )
}
