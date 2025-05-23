import React from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs'
import './ContactUs.css'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js'

export default function ContactUs(children) {
  return (
    <>
    <div className='container-contact'>


    <div className="custom-breadcrumbs">

      <div>
        <h3>Contact Us</h3>
        <Breadcrumbs/>
      </div>

    </div>

    <div className="mb-5 mx-3">
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.8243161456826!2d31.20716477541324!3d30.041897674924858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458472e6975bdc7%3A0xc8e7067e081db02!2sEraaSoft!5e0!3m2!1sen!2sus!4v1745715134006!5m2!1sen!2sus" width="600" height="450" style={{border: '0'}}  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>


    <div className='container-fluid get-in-touch d-flex flex-column flex-lg-row align-items-center justify-content-between gap-5'>

      <div className='w-75'>
        <h3 className='fw-bold'>GET IN TOUCH</h3>
        <p className=''>Please enter the details of your requesst. A member of our support staff will respond as soon as possible.</p>
        <div className='d-flex gap-3 mb-3'>
          <input className='w-100 contact-input' type="text" placeholder='YOUR NAME' />
          <input className='w-100 contact-input' type="text" placeholder='YOUR EMAIL' />
        </div>
        <input className='w-100 mb-3 contact-input' type="text" placeholder='PHONE NUMBER' />

      <div className="mb-3">
        <textarea placeholder="MESSAGE" rows="5" className="w-100 contact-input"></textarea>
      </div>
      </div>

      <div className='d-flex flex-column gap-3'>
        <p><span className='fw-bold'>Address:</span> 123 Suspendis matti, Visaosang Building VST District, NY Accums, North American</p>
        <p><span className='fw-bold'>Email:</span> support@domain.com</p>
        <p><span className='fw-bold'>Call Us:</span> (012)-345-67890</p>
        <p><span className='fw-bold'>Opening time:</span> Our store has re-opened for shopping, exchanges every day <span className='fw-bold'>11am to 7pm</span></p>
        <div className='d-flex gap-4'>
          <Link className='socia-media-icon text-light rounded d-flex align-items-center justify-content-center' to={'/contactus'}>
          <Icon icon="ri:facebook-fill" width="24" height="24" />
          </Link>
          <Link className='socia-media-icon text-light rounded d-flex align-items-center justify-content-center' to={'/contactus'}>
          <Icon icon="formkit:pinterest" width="16" height="16" />
          </Link>
          <Link className='socia-media-icon text-light rounded d-flex align-items-center justify-content-center' to={'/contactus'}>
          <Icon icon="ri:instagram-line" width="24" height="24" />
          </Link>
          <Link className='socia-media-icon text-light rounded d-flex align-items-center justify-content-center' to={'/contactus'}>
          <Icon icon="ri:twitter-fill" width="20" height="20" />
          </Link>
        </div>
      </div>
    </div>
    <div className="container-fluid">
    <button className="submit-contact rounded-pill">Submit</button>
    </div>
      

    </div>
    </>
  )
}
