// Login.jsx - Fix the storage of user data and add cart merging
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
// import { useCart } from '../../context/CartContext'; // Import cart context

const initialUser = {password: "", identifier: ""};

export default function Login() {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();
  // const { mergeCartsOnLogin } = useCart(); // Get mergeCartsOnLogin function

  const handleChange = ({ target }) => {
    const {name, value} = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = `http://localhost:1337/api/auth/local`
    try {
      if (user.identifier && user.password) {
        const { data } = await axios.post(url, user);
  
        Cookies.set('token', data.jwt, { expires: 7 }); // Optional if you use cookies
        localStorage.setItem('token', data.jwt);        //  Correct way
        localStorage.setItem('user', JSON.stringify(data.user));
  
        toast.success('Welcome!');
        setUser(initialUser);
       
        navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message || 'User not found';
      toast.error(msg);
      console.log(error.response?.data?.error?.message)
    }
  };
  
  return (
    <div>
      <div className="reg-container ">
        <div className="login-container register row  d-flex justify-content-between align-items-center ">
            <form action="" className='form col-12 col-lg-4 d-flex flex-column justify-content-center align-items-center gap-4'>
              <div className='d-flex flex-column justify-content-center align-items-center'>
              <h1 className='fw-bold'>Login</h1>
              <p className='text-secondary'>Login to your account</p>
              </div>

              <div className="reg-email d-flex flex-column justify-content-between align-items-start gap-2 w-100">
                <label htmlFor="">Email</label>
                <input type="email" 
                name='identifier'
                value={user.identifier} 
                onChange={handleChange} 
                placeholder='Enter your email' 
                className='input' 
                required/>
              </div>

              <div className="reg-password d-flex flex-column justify-content-between align-items-start gap-2 w-100">
                <label htmlFor="">Password</label>
                <input type="password" 
                name='password'
                value={user.password} 
                onChange={handleChange}                 
                placeholder='Enter your password' 
                className='input' 
                required/>
              </div>

              <button className='submit w-100 fw-bold continue-shooping' onClick={handleLogin}>Login</button>

              <p>Don't have account?<Link to={'/register'}>Create Account</Link></p>
            </form>

          <img src="/images/Zone7.png" alt="" className='img-background col-8  d-none d-lg-block '/>
        </div>
      </div>
    </div>
  )
}