// src/pages/Phonebook.jsx
import React, { useEffect, useState } from 'react'
import phoneData from '../data/phonebook.json'
import { fetchPhonebook } from '../lib/apiClient'

export default function Phonebook(){
  const [items, setItems] = useState(phoneData)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!import.meta.env.VITE_API_URL) return // use local data
      setLoading(true); setError('')
      try{
        const remote = await fetchPhonebook()
        if(mounted) setItems(remote)
      }catch(err){
        console.error('Phonebook load error', err)
        setError('Unable to load phonebook — using local copy.')
        if(mounted) setItems(phoneData)
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=> { mounted = false }
  }, [])

  useEffect(()=>{
    if(!q) return setItems(items => items = items) // no-op to keep local list
    const s = q.toLowerCase()
    setItems(prev => (phoneData.filter(p=> p.department.toLowerCase().includes(s) || p.phone.includes(s) || (p.notes||'').toLowerCase().includes(s))))
  }, [q])

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Important Numbers</h2>
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Search"
        className="w-full p-2 mb-4 rounded border bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
      />
      {loading && <div className="mb-3">Loading…</div>}
      {error && <div className="text-sm text-yellow-600 mb-3">{error}</div>}
      <div className="space-y-3">
        {items.map((p, idx)=> (
          <div key={idx} className="card p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{p.department}</div>
              <div className="text-sm muted">{p.notes}</div>
            </div>
            <div className="text-right">
              <a className="block text-blue-600" href={`tel:${p.phone}`}>{p.phone}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
