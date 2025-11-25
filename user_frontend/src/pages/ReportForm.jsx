import React, { useState } from 'react'
import FormField from '../components/FormField'
import MapPicker from '../components/MapPicker'
import ImageUploader from '../components/ImageUploader'
import { postReport } from '../lib/apiClient'
import { useNavigate } from 'react-router-dom'
import CustomDropdown from '../components/CustomDropdown'


const categories = ['Road','Sewage','Washroom','Garbage','Traffic','Other']

function validatePhone(phone){
  // basic indian 10-digit check
  const cleaned = phone.replace(/[^0-9]/g, '')
  return cleaned.length === 10
}

export default function ReportForm(){
  const [fullName, setFullName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const fullNameError = fullName.trim().length < 2 ? 'Enter your full name' : ''
  const phoneError = !validatePhone(contactNumber) ? 'Enter a valid 10-digit Indian mobile number' : ''
  const descError = description.trim().length < 10 ? 'Short description (min 10 chars)' : ''
  const locationError = !location ? 'Location is mandatory. Click "Capture Location".' : ''
  const imageError = !imageBase64 ? 'Attach a photo' : ''

  const canSubmit = !fullNameError && !phoneError && !descError && !locationError && !imageError && !submitting

  async function handleSubmit(e){
    e.preventDefault()
    if(!canSubmit) return
    setSubmitting(true); setError('')
    const payload = { fullName, contactNumber, category, description, location, imageBase64 }
    try{
      const res = await postReport(payload)
      if(res && res.reportId){
        nav(`/report/success/${res.reportId}`)
      }else if(res && res.success && res.reportId){
        nav(`/report/success/${res.reportId}`)
      }else{
        throw new Error('Unexpected response from server')
      }
    }catch(err){
      setError(err.message || 'Submission failed')
    }finally{ setSubmitting(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Report a Civic Issue</h2>

      <form onSubmit={handleSubmit} className="card card-body">
        <FormField label="Full name" error={fullNameError}>
          <input 
  value={fullName}
  onChange={e=>setFullName(e.target.value)}
  className="w-full p-2 rounded border bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
/>

        </FormField>

        <FormField label="Contact number" error={phoneError}>
          <input
  value={contactNumber}
  onChange={e=>setContactNumber(e.target.value)}
  placeholder="10-digit mobile"
  className="w-full p-2 rounded border bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
/>
</FormField>

<FormField label="Category">
  <CustomDropdown options={categories} value={category} onChange={setCategory} placeholder="Select category" className="w-full" />
</FormField>


        <FormField label="Description" error={descError}>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} className="w-full p-2 rounded border bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600" />
        </FormField>

        <FormField label="Location (GPS)" error={locationError}>
          <MapPicker value={location} onChange={setLocation} />
        </FormField>

        <FormField label="Attach Photo" error={imageError} >
          <ImageUploader onChange={setImageBase64} />
        </FormField>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <button disabled={!canSubmit} className={`w-full py-3 rounded text-white ${canSubmit ? 'bg-green-600' : 'bg-gray-400 btn-disabled'}`}>
          {submitting ? 'Submitting…' : 'Submit Report'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        Note: All fields are mandatory. Location access is required to submit a report.
      </div>
    </div>
  )
}
