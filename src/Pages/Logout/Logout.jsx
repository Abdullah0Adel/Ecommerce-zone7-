// Logout.jsx - Update to handle cart clearing on logout
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function Logout() {
  const navigate = useNavigate(); 

  const handleLogoutClick = () => {
    // Clear authentication
    Cookies.remove('token');
    localStorage.setItem('user', "");
    localStorage.setItem('token', "")
    
    
    toast.success('Logged out');
    navigate('/login')
  }

  return (
    <div>
      <button onClick={handleLogoutClick} className="btn btn-outline-danger">Logout</button>
    </div>
  )
}