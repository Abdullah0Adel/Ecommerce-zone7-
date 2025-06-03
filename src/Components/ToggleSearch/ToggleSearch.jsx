import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useRef, useState } from 'react'
import './ToggleSearch.css'
import BASE_URL from '../../Data/BASE_URL'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ToggleSearch({ onSearch, closeSearchToggle }) {
const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [allProducts, setAllProducts] = useState([]);
const [loading, setLoading] = useState(false);
const searchRef = useRef(null);
const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () =>{
            try {
                const response = await axios.get(`${BASE_URL}products`, {
                    params: {
                        populate: "*"
                    }
                })
                setAllProducts(response.data.data);
            }
             catch (error) {
                console.error("Error fetching products:", error)
            }
        }

        fetchProducts();
    }, []);


    const handleSearchChange = (e) => {
        const value = e.target.value;

        setSearchTerm(value);
        
        if (value.trim() === ""){
            setSearchResults([]);
            return;
        }

        setLoading(true);

        const filteredProducts = allProducts.filter(product =>
            product.product_name && product.product_name.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setSearchResults(filteredProducts);
        setLoading(false);
    }


    const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    const filteredProducts = allProducts.filter(product => 
      product.product_name && product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (onSearch) {
        onSearch(filteredProducts);
    }
    if (closeSearchToggle) {
        closeSearchToggle();
        navigate(`/productresults?search=${encodeURIComponent(searchTerm)}`)
    }
    
}

  return (
    <form  onSubmit={handleSearchSubmit}>
    <div className="toggle_search d-flex justify-content-between align-items-center">
      <input 
        type="search" 
        placeholder="Enter Your Keyword"
        value={searchTerm} 
        onChange={handleSearchChange}
        className="search_toggle_input w-100" 
      />
      <button 
        type="submit"
        aria-label="Search" 
      className="search_toggle_btn w-25 h-100"
      >
        <Icon className="searchIcon w-20" icon="ic:sharp-search" width="24" height="24" fontSize={30} />
      </button>
    </div>
    </form>
  )
}

export default ToggleSearch
