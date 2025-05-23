import React, { useEffect, useState } from 'react'
import './ProfileBar.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Logout from '../../Pages/Logout/Logout';


export default function ProfileBar() {
  const [userData, setUserData] = useState({})
    const token = Cookies.get("token");
    useEffect(() => {
      const storeData = localStorage.getItem("user");
      if (storeData) {
        setUserData(JSON.parse(storeData));
      }
    }, [])

  return (
    <div className='profileBar'>
      <ul className='d-flex flex-column justify-content-between align-items-start gap-5'>
        {!token && (
        <>

        <li>
            <Link className='prof-links text-decoration-none text-dark fw-bold' to={"/login"}>Login</Link>
        </li>
        <li>
            <Link className='prof-links text-decoration-none text-dark fw-bold' to={"/register"}>Register</Link>
        </li>
        </>
        )
        }
        {token &&(
            <>
            <li>
              <Link className='prof-links text-decoration-none text-dark fw-bold'>{userData.username}</Link>
            </li>
            <li>
            <Logout/>
            </li>
            </>
        )}

        <li>
            <Link to={'/checkout'} className='prof-links text-decoration-none text-dark fw-bold'>Wishlist</Link>
        </li>
        <li>
            <Link to={'/checkout'} className='prof-links text-decoration-none text-dark fw-bold'>Check out</Link>
        </li>
        <li>
            <Link to={'/your-order'} className='prof-links text-decoration-none text-dark fw-bold'>Your Order</Link>
        </li>
      </ul>
    </div>
  )
}
