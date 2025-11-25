import React from 'react'

export default function FormField({ label, children, error }){
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
    </div>
  )
}
