// Register.jsx - Update to handle cart merging after registration
import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useCart } from '../../context/CartContext'; // Import cart context

const initialUser = {username:"", email:"", password:"", confirmPassword:""}

export default function Register() {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();
  const { mergeCartsOnLogin } = useCart(); // Get mergeCartsOnLogin function

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const { username, email, password, confirmPassword } = user;
      const url = 'http://localhost:1337/api/auth/local/register';
  
      if (!username || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
  
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
  
      const res = await axios.post(url, { username, email, password });
      
      //Set token in cookies
      Cookies.set('token', res.data.jwt, { expires: 7 });

      //local storage - save user data
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Merge any items in local cart with the new user's cart
      await mergeCartsOnLogin(res.data.user.id);
      
      toast.success("Registered successfully!");
      setUser(initialUser);
      navigate("/");
    } 
    catch (error) {
      const msg = error.response?.data?.error?.message || 'Something went wrong!';
      toast.error(msg);
    }
  };
    
  const handleUserChange = ({ target }) => {
    const {name, value} = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value
    }))
  }

  return (
    <div>
      <div className="reg-container ">
        <div className="register row d-flex justify-content-between align-items-center">
            <form className='form col-12 col-lg-4 d-flex flex-column justify-content-center align-items-center gap-4'>
              <h1>Create Account</h1>
              <div className="reg-name d-flex flex-column justify-content-between align-items-start gap-2 w-100">
                <label htmlFor="">Your Name</label>
                <input 
                type="text" 
                name='username'
                value={user.username}
                onChange={handleUserChange}
                placeholder='enter your name' 
                className='input' 
                required/>
              </div>

              <div className="reg-email d-flex flex-column justify-content-between align-items-start gap-2 w-100">
                <label htmlFor="">Email</label>
                <input 
                type="email" 
                name='email'
                value={user.email}
                onChange={handleUserChange}
                placeholder='Email' 
                className='input' 
                required/>
              </div>

              <div className="reg-password d-flex flex-column justify-content-between align-items-start gap-2 w-100">
                <label htmlFor="">Password</label>
                <input 
                type="password" 
                name='password'
                value={user.password}
                onChange={handleUserChange}
                placeholder='Password' 
                className='input' 
                required/>
              </div>

              <div className="reg-confirmPass d-flex flex-column justify-content-between align-items-start gap-2 w-100">
                <label htmlFor="">Confirm Password</label>
                <input 
                type="password"
                name='confirmPassword'
                value={user.confirmPassword}
                onChange={handleUserChange}
                placeholder='Confirm Password' 
                className='input' 
                required/>
              </div>

              <button className='submit w-100 fw-bold continue-shooping' onClick={signUp}>Submit</button>

              <p>You have an account?<Link to={'/login'}>Login</Link></p>
            </form>

          <img src="/images/Zone7.png" alt="" className=' img-background col-8 d-none d-lg-block '/>
        </div>
      </div>
    </div>
  )
}