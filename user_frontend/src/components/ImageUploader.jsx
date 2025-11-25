import React, { useState } from 'react'

export default function ImageUploader({ onChange }){
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  function handleFile(e){
    setError('')
    const file = e.target.files[0]
    if(!file) return
    if(!file.type.startsWith('image/')) return setError('Please upload an image file')
    if(file.size > 5 * 1024 * 1024) return setError('File too large. Max 5MB')

    const reader = new FileReader()
    reader.onload = function(ev){
      setPreview(ev.target.result)
      onChange(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      {error && <div className="text-sm text-red-500">{error}</div>}
      {preview && <img src={preview} alt="preview" className="mt-2 w-48 rounded shadow" />}
    </div>
  )
}
