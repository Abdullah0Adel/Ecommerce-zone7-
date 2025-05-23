import React from 'react'
import './Error.css'
import { Link } from 'react-router-dom'

export default function Error() {
  return (
    <div className='error-page d-flex flex-column justify-content-center align-items-center gap-5'>
      <h1 className='error-404 fw-bold'>404</h1>
      <div className='d-flex flex-column gap-3 align-items-center'>
      <h1 className='fw-bold'>PAGE NOT FOUND</h1>
      <p className='fs-4 fw-bold'>We’re sorry — something has gone wrong on our end.</p> 
      </div>
      <div className="error-btn d-flex gap-4">
        <button className='rounded-pill p-3 border-none text-white fw-bold'><Link className='text-white text-decoration-none' to={'/'}>Back To Homepage</Link></button>
        <button className='rounded-pill p-3 border-none text-white fw-bold'><Link className='text-white text-decoration-none' to={'/shop'}>Continue Shopping</Link></button>
      </div>
      
    </div>
  )
}
