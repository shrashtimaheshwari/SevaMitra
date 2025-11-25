import React, { useState } from 'react'

export default function MapPicker({ value, onChange }){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openInMaps(lat, lng){
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, '_blank')
  }

  async function capture(){
    setError('')
    if(!navigator.geolocation) return setError('Geolocation not supported by your browser')
    setLoading(true)
    navigator.geolocation.getCurrentPosition((pos)=>{
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      onChange({ lat, lng })
      setLoading(false)
    }, (err)=>{
      setLoading(false)
      setError('Location access is required. Please enable GPS and reload.')
    }, { enableHighAccuracy: true, timeout: 10000 })
  }

  const staticMapUrl = value?.lat && value?.lng
    ? `https://staticmap.openstreetmap.de/staticmap.php?center=${value.lat},${value.lng}&zoom=16&size=400x250&markers=${value.lat},${value.lng},red`
    : null

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <button type="button" onClick={capture} className="px-3 py-2 bg-blue-600 text-white rounded">Capture Location</button>
        {loading && <div className="text-sm">Capturing…</div>}
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {staticMapUrl && (
        <div className="bg-white dark:bg-gray-800 rounded shadow p-2 mb-2">
          <img src={staticMapUrl} alt="map preview" className="w-full h-auto rounded" />
          <div className="mt-2 text-sm">Latitude: {value.lat.toFixed(6)} • Longitude: {value.lng.toFixed(6)}</div>
          <div className="mt-2">
            <button type="button" onClick={()=> openInMaps(value.lat, value.lng)} className="text-sm underline">Open in Google Maps</button>
          </div>
        </div>
      )}

      {!staticMapUrl && !loading && <div className="text-sm text-gray-500">No location captured yet.</div>}
    </div>
  )
}
