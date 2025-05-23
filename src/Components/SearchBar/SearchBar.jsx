import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/products', {
          params: {
            populate: "*"
          }
        })
        setAllProducts(response.data.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value.trim() === "") {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    
    // Filter products based on search term
    const filteredProducts = allProducts.filter(product => 
      product.product_name && product.product_name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5) // Limit to 5 results for better UX

    setSearchResults(filteredProducts)
    setShowResults(true)
    setIsLoading(false)
  }

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim() === "") return

    // Filter all products based on search term for full search
    const filteredProducts = allProducts.filter(product => 
      product.product_name && product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Call the onSearch prop to pass search results to parent component
    if (onSearch) {
      onSearch(filteredProducts)
    }
    
    // Navigate to the ProductResults page with search term as query parameter
    navigate(`/productresults?search=${encodeURIComponent(searchTerm)}`)
    
    // Clear dropdown results after search submission
    setShowResults(false)
  }

  // Handle clicking outside of search component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={searchRef} className="position-relative">
      <div className="search__canvas">
        <form onSubmit={handleSearchSubmit} className="search_header w-100 d-flex">
          <div className="position-relative flex-grow-1">
            <input 
              className="search_input w-100" 
              type="search" 
              placeholder="Enter Your Keyword"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search products"
            />
          </div>
          <button 
            type="submit" 
            className="search_button d-flex justify-content-center align-items-center"
            aria-label="Search"
          >
            <Icon 
              className="searchIcon text-white" 
              icon="ic:sharp-search" 
              width="24" 
              height="24" 
            />
          </button>
        </form>
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div 
          className="search-results-dropdown position-absolute w-100 bg-white shadow-lg rounded-bottom z-index-9"
          style={{ 
            maxHeight: '50vh', 
            overflowY: 'auto',
            zIndex: 1000,
            border: '1px solid #dee2e6'
          }}
        >
          {isLoading ? (
            <div className="d-flex justify-content-center p-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {searchResults.map((product) => (
                <li key={product.id} className="list-group-item py-2 px-3">
                  <Link 
                    to={`/products/${product.documentId || product.id}`}
                    className="text-decoration-none text-dark d-flex align-items-center"
                    onClick={() => setShowResults(false)}
                  >
                    {product.thumbnail && (
                      <img 
                        src={`http://localhost:1337${product.thumbnail.url}`} 
                        alt={product.product_name}
                        className="me-2" 
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div className="fw-bold">{product.product_name}</div>
                      <div className="text-success">
                        EGP {product.hasDiscount 
                          ? (product.product_price - (product.product_price * product.discount_value / 100)).toFixed(2)
                          : product.product_price.toFixed(2)
                        }
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="list-group-item text-center py-2">
                <button 
                  className="btn btn-sm btn-outline-primary w-100"
                  onClick={handleSearchSubmit}
                >
                  See all results
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      
      {showResults && searchResults.length === 0 && searchTerm !== "" && (
        <div 
          className="search-results-dropdown position-absolute w-100 bg-white shadow-lg rounded-bottom"
          style={{ 
            maxHeight: '25vh', 
            zIndex: 1000,
            border: '1px solid #dee2e6'
          }}
        >
          <div className="p-3 text-center text-muted">
            No products found matching "{searchTerm}"
          </div>
        </div>
      )}
      
    </div>
  )
}

export default SearchBar