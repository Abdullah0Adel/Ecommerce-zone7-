import React, { useEffect, useState } from 'react'
import './ProfileBar.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Logout from '../../Pages/Logout/Logout';


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

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

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
              <li className={`${isActiveLink("/profile")? "nav-profile-link-active" : "" }`}>
                {userData.username}
              </li>
            </Link>
            </>
        )}

        <Link  onClick={handleCloseProfileBar} to={'/wishlist'} className='prof-links text-decoration-none text-dark fw-bold'>
          <li className={`${isActiveLink("/wishlist")? "nav-profile-link-active" : "" }`}>
              Wishlist
          </li>
        </Link>

        <Link  onClick={handleCloseProfileBar} to={'/checkout'} className='prof-links text-decoration-none text-dark fw-bold'>
            <li className={`${isActiveLink("/checkout")? "nav-profile-link-active" : "" }`}>
                Check out
            </li>
        </Link>

        <Link  onClick={handleCloseProfileBar} to={'/yourorder'} className='prof-links text-decoration-none text-dark fw-bold'>
          <li className={`${isActiveLink("/yourorder")? "nav-profile-link-active" : "" }`}>
              Your Order
          </li>
        </Link>
                {token &&(
            <>
            <Link  onClick={handleCloseProfileBar} to={"/profile"} className='prof-links text-decoration-none text-dark fw-bold'>

                <Logout/>
                
            </Link>
            </>
        )}
      </ul>
    </div>
  )
}
