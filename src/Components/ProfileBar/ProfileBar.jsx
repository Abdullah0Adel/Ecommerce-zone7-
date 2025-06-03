import React, { useEffect, useState } from 'react'
import './ProfileBar.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';


export default function ProfileBar( closeProfileBar ) {
  const [userData, setUserData] = useState({})
    const token = Cookies.get("token");
    useEffect(() => {
      const storeData = localStorage.getItem("user");
      if (storeData) {
        setUserData(JSON.parse(storeData));
      }
    }, [])

    const handleCloseProfileBar = () => {
      if(closeProfileBar){
        closeProfileBar();
      }
    }
  return (
    <div className='profileBar'>
      <ul className='d-flex flex-column justify-content-between align-items-start gap-5'>
        {!token && (
        <>


        <Link className='prof-links text-decoration-none text-dark fw-bold' to={"/login"}>
          <li>
              Login
          </li>
        </Link>

        <Link className='prof-links text-decoration-none text-dark fw-bold' to={"/register"}>
          <li>
              Register
          </li>
        </Link>
        </>
        )
        }
        {token &&(
            <>
            <Link  onClick={handleCloseProfileBar} to={"/profile"} className='prof-links text-decoration-none text-dark fw-bold'>
              <li>
                {userData.username}
              </li>
            </Link>
            </>
        )}

        <Link  onClick={handleCloseProfileBar} to={'/wishlist'} className='prof-links text-decoration-none text-dark fw-bold'>
          <li>
              Wishlist
          </li>
        </Link>

        <Link  onClick={handleCloseProfileBar} to={'/checkout'} className='prof-links text-decoration-none text-dark fw-bold'>
            <li>
                Check out
            </li>
        </Link>

        <Link  onClick={handleCloseProfileBar} to={'/your-order'} className='prof-links text-decoration-none text-dark fw-bold'>
          <li>
              Your Order
          </li>
        </Link>
      </ul>
    </div>
  )
}
