import React, { useState, useEffect } from "react";
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import ProfileBar from "../../Components/ProfileBar/ProfileBar";
import CartBar from "../../Components/CartBar/CartBar";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext'; // Import cart context
import ToggleSearch from "../../Components/ToggleSearch/ToggleSearch";

export default function Navbar() {
  const [isHover, toggleHover] = React.useState(false);
  const toggleHoverMenu = () => {
    toggleHover(!isHover);
  };
  const { 
    cartItems, 
  } = useCart();
  const cartCount = cartItems.length;

    const {
      wishlistItems,
    } = useWishlist();
  const wishlistCount = wishlistItems.length; 

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5
      },
      display: "block"
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.3,
        delay: 0.3
      },
      transitionEnd: {
        display: "none"
      }
    }
  };
       
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  
  // Improved scroll functionality
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll event with debounce for better performance
  useEffect(() => {
    let scrollTimer;
    
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrollingUp = prevScrollPos > currentScrollPos;
      
      // Only update visibility when scrolling a significant amount (more than 5px)
      if (Math.abs(prevScrollPos - currentScrollPos) > 5) {
        setVisible(
          isScrollingUp || currentScrollPos < 10
        );
      }
      
      // Update previous scroll position
      setPrevScrollPos(currentScrollPos);
    };

    // Throttle scroll events for better performance
    const throttledHandleScroll = () => {
      if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
          handleScroll();
          scrollTimer = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(scrollTimer);
    };
  }, [prevScrollPos]);

  // Toggle menu state
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearchBar = () => {
    setSearchOpen(!isSearchOpen);
  }

  const handleProfileBar = () => {
    setProfileOpen(!isProfileOpen);
  }

  const handleCartBar = () => {
    setCartOpen(!isCartOpen)
  }

  const isActiveLink = (path) => {
    return location.pathname === path;
  };


  return (
    <>
    <div className="navbar-root-container">
      {/* Overlay layer - now with higher z-index */}
      <div 
        onClick={() => {
          if (isCartOpen) handleCartBar();
          if (isProfileOpen) handleProfileBar();
          if (isSearchOpen) handleSearchBar();
          if (isMenuOpen) handleMenuToggle();
        }} 
        className={`global-overlay ${isCartOpen || isProfileOpen || isSearchOpen || isMenuOpen ? "overlay_appear" : ""}`}
      ></div>

      {/* shopping cart bar */}
      <div className={`cart_bar ${isCartOpen ? "cart_bar_active" : ""} `}>
        <CartBar/>
      </div>

      {/* Start Profile Bar */}
      <div className={`profile_bar_component ${isProfileOpen ? "profile_bar_component_active" : ""} `}>
        <ProfileBar closeProfileBar={() => {setProfileOpen(false)}} />
      </div>
      {/* End Profile Bar */}

      {/* Search Bar */}
      <div className={`search_bar ${isSearchOpen ? "search_bar_active" : ""} bg-white`}>
        <SearchBar closeSearchBar={() => {setSearchOpen(false)}}/>  
      </div>

      {/* Sidebar Menu */}
      <div className={`toggle_click ${isMenuOpen ? "toggle__active" : ""}`}>
        <div className="toggle_menu">
          <ToggleSearch  closeSearchToggle={() => {setIsMenuOpen(false)}} />

          <div className="d-flex flex-column">    
            <ul className="toggle_list">
              <Link
              onClick={()=>{
                setIsMenuOpen(false);
              } }
               className={`nav_link`} to={'/'}
               >
                <li className={`toggle_link ${isActiveLink("/") ? "nav-bottom-link-active" : ""}`}>Home</li>
              </Link>
              <Link
              onClick={()=>{
                setIsMenuOpen(false);
              } }
              className={`nav_link `} to={'/shop'}>
                <li className={`toggle_link ${isActiveLink("/shop")? "nav-bottom-link-active" : "" }`}>Shop</li>
              </Link>
              <Link 
              onClick={()=>{
                setIsMenuOpen(false);
              } }
              className={`nav_link `} to={'/aboutus'}>
                <li className={`toggle_link ${isActiveLink("/aboutus")? "nav-bottom-link-active" : "" }`}>About Us</li>
              </Link>
              <Link 
              onClick={()=>{
                setIsMenuOpen(false);
              } }
              className={`nav_link `} to={'/contactus'}>
                <li className={`toggle_link ${isActiveLink("/contactus")? "nav-bottom-link-active" : "" }`}>Contact Us</li>
              </Link>

            </ul>
          </div>
        </div>
      </div>

      {/* Main Navbar - now with better scroll-based visibility class */}
      <div className={`navbar-scroll-container ${visible ? "navbar-visible" : "navbar-hidden"}`}>
        <div className='container-nav'>
          <nav className='nav row w-100 d-flex align-items-center justify-content-round'>
            {/* Logo & Toggle Button */}
            <div className="logo-div col-4 d-flex gap-3">
              <div onClick={handleMenuToggle} className="nav_toggler d-flex gap-2 align-self-center">
                <Icon className="toggle" icon="iconamoon:menu-burger-horizontal-bold" width="24" height="24" />
              </div>
              <Link to={'/'}><img className='canabuzz' src="/images/Zone7-logoNav.png" alt="Logo" /></Link>
            </div>

            {/* Navbar Links */}
            <ul className='nav_menu col-4 d-flex justify-content-center gap-3'>
              <li className={`nav_item text-center ${isActiveLink("/")? "toggle-link-main-active" : "" }`}><Link className='nav_link' to={'/'}>Home</Link></li>
              <li className={`nav_item text-center ${isActiveLink("/shop")? "toggle-link-main-active" : "" }`}><Link className='nav_link' to={'/shop'}>Shop</Link></li>
              <li className={`nav_item text-center ${isActiveLink("/aboutus")? "toggle-link-main-active" : "" }`}><Link className='nav_link' to={'/aboutus'}>About Us</Link></li>
              <li className={`nav_item text-center ${isActiveLink("/contactus")? "toggle-link-main-active" : "" }`}><Link className='nav_link' to={'/contactus'}>Contact Us</Link></li>
            </ul>

            {/* Icons */}
            <ul className='nav_menu nav_menu_icons col-4 m-0 d-flex gap-4 justify-content-end'>
              <li onClick={handleSearchBar}><Icon className="searchIcon" icon="ic:sharp-search" width="24" height="24" fontSize={30} /></li> 
              <li onClick={handleProfileBar} className={`text-dark ${isActiveLink("/profile")? "toggle-link-active" : "" }`}><Icon icon="line-md:account" width="24" height="24" /></li>
              <Link to={'/wishlist'} className={`text-dark ${isActiveLink("/wishlist")? "toggle-link-active" : "" }`} >
              <li>
                <Icon icon="solar:heart-linear" width="24" height="24" />
                  {wishlistCount > 0 && (
                  <span className="position-absolute bg-danger wishlist_count">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
            )}
              </li>
              </Link>
              <Link to={"/cartpage"} className={`text-dark ${isActiveLink("/cartpage")? "toggle-link-active" : "" }`}>
                <li>
                  <Icon icon="solar:cart-large-2-broken" width="24" height="24" />
                  {cartCount > 0 && (
                  <span className="position-absolute  bg-danger cart-count">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                  )}
                </li>
              </Link>
            </ul>
          </nav>
        </div>

        <div className="container_nav_mobile px-1">
          <div className="nav_mobile row h-100 align-items-center justify-content-between">
            <div className="col-3 d-flex align-items-center gap-3">
              <div onClick={handleMenuToggle} className="nav_toggler">
                <Icon icon="iconamoon:menu-burger-horizontal-bold" width="24" height="24" />
              </div>
              <div onClick={handleSearchBar} className="">          
                <Icon className="searchIcon w-20" icon="ic:sharp-search" width="24" height="24" fontSize={30} />
              </div>
            </div>
            <div className="col-6 d-flex justify-content-center align-items-center m-auto">
              <Link to={'/'}><img className='canabuzz_mobileView' src="/images/Zone7-logoNav.png" alt="Logo" /></Link>
            </div>
            <div className="col-3 d-flex align-items-center justify-content-end">
              <Link to={"/cartpage"} className={`text-dark `}>
              <Icon icon="la:shopping-bag" width="25" height="25" />
                  {cartCount > 0 && (
                  <span className="position-absolute  bg-danger cart-count-mobile">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                  )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container_nav_bottom">
        <div className="row">
          <Link to={'/'} className={`bottom_link col-3 gap-1 d-flex flex-column justify-content-center align-items-center ${isActiveLink("/") ? "nav-bottom-link-active" : ""}`}>
            <Icon icon="tabler:home" width="24" height="24" />
            <p className={`${isActiveLink("/") ? "nav-bottom-link-active-p" : ""}`}>Home</p>
          </Link>
          <Link to={'/shop'} className={`bottom_link col-3 d-flex gap-1 flex-column justify-content-center align-items-center ${isActiveLink("/shop") ? "nav-bottom-link-active" : ""}`}>
            <Icon icon="lsicon:shelf-outline" width="24" height="24" />            
            <p className={`${isActiveLink("/shop") ? "nav-bottom-link-active-p" : ""}`}>Shopping</p>
          </Link>
          <Link to={'/wishlist'} className={`bottom_link col-3 d-flex gap-1 flex-column justify-content-center align-items-center ${isActiveLink("/wishlist") ? "nav-bottom-link-active" : ""}`}>
          <div className="position-relative pt-1 pe-1">
            <Icon icon="solar:heart-linear" width="24" height="24" />
            {wishlistCount > 0 && (
              <span className="position-absolute bg-danger wishlist_count ">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </div>
            <p className={`${isActiveLink("/wishlist") ? "nav-bottom-link-active-p" : ""}`}>Wishlist</p>
          </Link>
          <div onClick={handleProfileBar} className={`bottom_link col-3 d-flex gap-1 flex-column justify-content-center align-items-center ${isActiveLink("/profile")? "nav-bottom-link-active" : "" }`}>
            <Icon icon="line-md:account" width="24" height="24" />
            <p className={`${isActiveLink("/profile") ? "nav-bottom-link-active-p" : ""}`}>Account</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}