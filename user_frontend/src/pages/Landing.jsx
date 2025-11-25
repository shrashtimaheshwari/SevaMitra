import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing(){
  const nav = useNavigate()
  return (
    <div className="max-w-xl mx-auto text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">SevaMitra</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Report civic issues in your area — quickly and anonymously if you choose.</p>

      <div className="space-y-4">
        <button onClick={()=> nav('/report')} className="w-full py-4 bg-blue-600 text-white rounded text-lg">Report a Civic Issue</button>
        <button onClick={()=> nav('/phonebook')} className="w-full py-4 border rounded text-lg flex items-center justify-center space-x-2">
          <span>📞</span>
          <span>Important Numbers (Phonebook)</span>
        </button>
      </div>

    </div>
  )
}
