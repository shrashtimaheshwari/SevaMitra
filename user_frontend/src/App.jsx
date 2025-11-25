import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Phonebook from './pages/Phonebook'
import ReportForm from './pages/ReportForm'
import Success from './pages/Success'
import Navbar from './components/Navbar'

export default function App(){
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/phonebook" element={<Phonebook />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/report/success/:id" element={<Success />} />
        </Routes>
      </main>
    </div>
  )
}
