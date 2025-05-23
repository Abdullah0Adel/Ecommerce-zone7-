import React, { useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs'
import axios from 'axios';
import { useEffect } from 'react';
import ProductCard from '../../Components/ProductCard/ProductCard';
import { useShopContext } from '../../context/ShopContext'; // Import the context hook
import './Shop.css'
import { Icon } from '@iconify/react/dist/iconify.js';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openFilterToggle, setOpenFilterToggle] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [categories, setCategories] = useState([])
  
  // Get state and functions from ShopContext instead of local state
  const {
    selectedCategories,
    selectedSubcategories,
    inStockOnly,
    priceRange,
    currentPage,
    expandedSections,
    resetAllFilters,
    resetFilter,
    toggleSection,
    handleCategoryChange,
    handleSubcategoryChange,
    paginate,
    resetPagination,
    setPriceRange,
    setInStockOnly
  } = useShopContext();

  useEffect(() => {
    const getProducts = () => {
      try{
        let domain = `http://localhost:1337/`;
        let endPoint = `api/products`;
        let url = domain + endPoint;
        axios
        .get(url,{
          params: {
            populate: "*"
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setProducts(res.data.data);
        });
      }catch(error){
        console.log(error)
      }
    };

    getProducts();
  },[])

  useEffect(() => {
    const getCategories = () => {
      try{
        let domainCat = `http://localhost:1337/`;
        let endPointCat = 'api/categories'; 
        let urlCat = domainCat + endPointCat;
        axios.get(urlCat,{
          params: {
            populate: "*"
          },
        })
        .then((response) => {
          console.log(response.data.data);
          setCategories(response.data.data);
        });
        
      }
      catch(error){
        console.log(error)
      }
    }
    getCategories();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.categories &&
          p.categories.some(
            (cat) => selectedCategories.includes(cat.category_name.toLowerCase())
          )
      );
    }

    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.sub_categories &&
          p.sub_categories.some((sub) =>
            selectedSubcategories.includes(sub.title.toLowerCase())
          )
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.product_availability === 'in stock');
    }

    filtered = filtered.filter(
      (p) =>
        p.product_price >= priceRange[0] &&
        p.product_price <= priceRange[1]
    );

    setFilteredProducts(filtered);
    resetPagination(1)
  }, 
  [selectedCategories, selectedSubcategories, inStockOnly, priceRange, products]);

  // Calculate pagination variables
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Categories data structure
  const categoryData = [
    {
      name: 'Football Jerseys',
      count: 12,
      subcategories: [
        { name: 'Player Edition', count: products.length},
        { name: 'Fan Edition', count: 4 },
        { name: 'Winter Collection', count: 2 },
        { name: 'Retro Version', count: 1 }
      ]
    },
    {
      name: 'Shirts',
      count: 8,
      subcategories: []
    },
    {
      name: 'Pants',
      count: 6,
      subcategories: []
    },
    {
      name: 'Shose',
      count: 10,
      subcategories: [
        { name: 'Running Shoes', count: 6 },
        { name: 'Soccer Boots', count: 4 }
      ]
    },
    {
      name: 'Jackets',
      count: 5,
      subcategories: []
    }
  ];

  // Fixed handlerFilterToggle function to properly toggle the filter
  const handlerFilterToggle = () => {
    setOpenFilterToggle(!openFilterToggle);
  }

  // Animation styles for dropdown content
  const filterContentStyle = (isExpanded) => ({
    maxHeight: isExpanded ? '500px' : '0px',
    opacity: isExpanded ? 1 : 0,
    overflow: 'hidden',
    transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
    marginBottom: isExpanded ? '1rem' : '0',
  });

  // Animation for chevron rotation
  const chevronStyle = (isExpanded) => ({
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease-in-out',
    display: 'inline-block',
  });







  return (
    <div>
      <div className="breadcrumbs-img">
        <div>
          <h3>Shop</h3>
          <Breadcrumbs/>
        </div>
      </div>
      <div
        onClick={() => {
          // only close when it's already open
          if (openFilterToggle) handlerFilterToggle();
        }}
        className={`global-overlay ${openFilterToggle ? "overlay_appear" : ""}`}
      ></div>
      

      
      {/* Mobile Filters - with smooth animation */}
      <div className={`filters-toggle ${openFilterToggle ? "filters-toggle-active" : ""}`} 
           style={{
             opacity: openFilterToggle ? 1 : 0,
             left: openFilterToggle ? '0' : '-340px',
             zIndex: 9001,
             padding: '20px',
             height: '100vh',
             overflowY: 'auto',
             boxShadow: openFilterToggle ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
             transition: 'opacity 0.7s ease-in-out, left 0.3s ease-in-out'
           }}>
        {/* Price Filter */}
        <div className="filter-section mb-3">
          <div 
            className="filter-header d-flex justify-content-between align-items-center p-2"
            onClick={() => toggleSection('price')}
            style={{ cursor: 'pointer', borderRadius: '4px', }}
          >
            <h6 className="m-0 fw-bold">PRICE</h6>
            <div className="d-flex align-items-center">
              <span 
                className="reset-text me-2" 
                onClick={(e) => { e.stopPropagation(); resetFilter('price'); }}
                style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}
              >
                RESET
              </span>
              <span style={chevronStyle(expandedSections.price)}><Icon icon="solar:alt-arrow-down-line-duotone" width="24" height="24" /></span>
            </div>
          </div>
          
          <div style={filterContentStyle(expandedSections.price)}>
            <div className="filter-body p-2">
              <div className="price-range">
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="form-range"
                />
                <div className="d-flex justify-content-between">
                  <div className="position-relative" style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={priceRange[0].toFixed(2)} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0) {
                          setPriceRange([val, priceRange[1]]);
                        }
                      }}
                    />
                  </div>
                  <div className="mx-2 d-flex align-items-center">—</div>
                  <div className="position-relative" style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={priceRange[1].toFixed(2)} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= priceRange[0]) {
                          setPriceRange([priceRange[0], val]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className='mb-3' />

        {/* Category Filter */}
        <div className="filter-section mb-3">
          <div 
            className="filter-header d-flex justify-content-between align-items-center p-2"
            onClick={() => toggleSection('categories')}
            style={{ cursor: 'pointer', borderRadius: '4px', }}
          >
            <h6 className="m-0 fw-bold">CATEGORY</h6>
            <div className="d-flex align-items-center">
              <span 
                className="reset-text me-2" 
                onClick={(e) => { e.stopPropagation(); resetFilter('categories'); }}
                style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}
              >
                RESET
              </span>
              <span style={chevronStyle(expandedSections.categories)}><Icon icon="solar:alt-arrow-down-line-duotone" width="24" height="24" /></span>
            </div>
          </div>
          
          <div style={filterContentStyle(expandedSections.categories)}>
            <div className="filter-body p-2">
              {categoryData.map((category) => (
                <div key={category.name} className="mb-2">
                  <div className="form-check d-flex justify-content-between">
                    <div className='d-flex justify-content-between align-items-center'>
                      <input
                        className="form-check-dark rounded custom-checkbox"
                        type="checkbox"
                        id={`cat-${category.name}`}
                        style={{height:"20px", width:"40px" }}
                        checked={selectedCategories.includes(category.name.toLowerCase())}
                        onChange={() => handleCategoryChange(category.name)}
                      />
                      <label className="form-check-label" htmlFor={`cat-${category.name}`}>
                        {category.name}
                      </label>
                    </div>
                    <span className="text-muted">({category.count})</span>
                  </div>
                  
                  {/* Show subcategories with animation */}
                  {selectedCategories.includes(category.name.toLowerCase()) && category.subcategories.length > 0 && (
                    <div className="ps-4 mt-2" style={{
                      maxHeight: '200px',
                      opacity: 1,
                      transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                    }}>
                      {category.subcategories.map((subcat) => (
                        <div key={subcat.name} className="form-check d-flex justify-content-between mb-1">
                          <div className='d-flex justify-content-between align-items-center'>
                            <input
                              className="form-check-dark rounded custom-checkbox"
                              type="checkbox"
                              id={`subcat-${subcat.name}`}
                              style={{height:"20px", width:"40px" }}
                              checked={selectedSubcategories.includes(subcat.name.toLowerCase())}
                              onChange={() => handleSubcategoryChange(subcat.name)}
                            />
                            <label className="form-check-label" htmlFor={`subcat-${subcat.name}`}>
                              {subcat.name}
                            </label>
                          </div>
                          <span className="text-muted">({subcat.count})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className='mb-3' />

        {/* Stock Filter */}
        <div className="filter-section mb-3">
          <div 
            className="filter-header d-flex justify-content-between align-items-center p-2"
            onClick={() => toggleSection('stock')}
            style={{ cursor: 'pointer', borderRadius: '4px', }}
          >
            <h6 className="m-0 fw-bold">AVAILABILITY</h6>
            <div className="d-flex align-items-center">
              <span 
                className="reset-text me-2" 
                onClick={(e) => { e.stopPropagation(); resetFilter('stock'); }}
                style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}
              >
                RESET
              </span>
              <span style={chevronStyle(expandedSections.stock)}><Icon icon="solar:alt-arrow-down-line-duotone" width="24" height="24" /></span>
            </div>
          </div>
          
          <div style={filterContentStyle(expandedSections.stock)}>
            <div className="filter-body p-2">
              <div className="form-check d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                  <input
                    className="form-check-dark rounded custom-checkbox"
                    style={{height:"20px", width:"40px" }}                          
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                    id="stockCheck"
                  />
                  <label className="form-check-label" htmlFor="stockCheck">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear All Filters Button */}
        <button
          className="btn btn-outline-secondary w-100 mt-3"
          onClick={resetAllFilters}
        >
          Clear All Filters
        </button>
      </div>










      <div className=" container-custom mt-5 mb-5 pb-5">
        <div className="shop-content row g-5">

          <div className="shop-left d-lg-block d-none col-3">
            {/* Desktop filter sidebar with same animations */}
            <div className="filters">
              {/* Price Filter */}
              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center p-2"
                  onClick={() => toggleSection('price')}
                  style={{ cursor: 'pointer', borderRadius: '4px', }}
                >
                  <h6 className="m-0 fw-bold">PRICE</h6>
                  <div className="d-flex align-items-center">
                    <span 
                      className="reset-text me-2" 
                      onClick={(e) => { e.stopPropagation(); resetFilter('price'); }}
                      style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}
                    >
                      RESET
                    </span>
                    <span style={chevronStyle(expandedSections.price)}><Icon icon="solar:alt-arrow-down-line-duotone" width="24" height="24" /></span>
                  </div>
                </div>
                
                <div style={filterContentStyle(expandedSections.price)}>
                  <div className="filter-body p-2">
                    <div className="price-range">
                      <input
                        type="range"
                        min={0}
                        max={5000}
                        step={100}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="form-range"
                      />
                      <div className="d-flex justify-content-between">
                        <div className="position-relative" style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={priceRange[0].toFixed(2)} 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0) {
                                setPriceRange([val, priceRange[1]]);
                              }
                            }}
                          />
                        </div>
                        <div className="mx-2 d-flex align-items-center">—</div>
                        <div className="position-relative" style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={priceRange[1].toFixed(2)} 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= priceRange[0]) {
                                setPriceRange([priceRange[0], val]);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className='mb-3' />

              {/* Category Filter */}
              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center p-2"
                  onClick={() => toggleSection('categories')}
                  style={{ cursor: 'pointer', borderRadius: '4px', }}
                >
                  <h6 className="m-0 fw-bold">CATEGORY</h6>
                  <div className="d-flex align-items-center">
                    <span 
                      className="reset-text me-2" 
                      onClick={(e) => { e.stopPropagation(); resetFilter('categories'); }}
                      style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}
                    >
                      RESET
                    </span>
                    <span style={chevronStyle(expandedSections.categories)}><Icon icon="solar:alt-arrow-down-line-duotone" width="24" height="24" /></span>
                  </div>
                </div>
                
                <div style={filterContentStyle(expandedSections.categories)}>
                  <div className="filter-body p-2">
                    {categoryData.map((category) => (
                      <div key={category.name} className="mb-2">
                        <div className="form-check d-flex justify-content-between">
                          <div className='d-flex justify-content-between align-items-center'>
                            <input
                              className="form-check-dark rounded custom-checkbox"
                              type="checkbox"
                              id={`desktop-cat-${category.name}`}
                              style={{height:"20px", width:"40px" }}
                              checked={selectedCategories.includes(category.name.toLowerCase())}
                              onChange={() => handleCategoryChange(category.name)}
                            />
                            <label className="form-check-label" htmlFor={`desktop-cat-${category.name}`}>
                              {category.name}
                            </label>
                          </div>
                          <span className="text-muted">({category.count})</span>
                        </div>
                        
                        {/* Show subcategories with animation */}
                        {selectedCategories.includes(category.name.toLowerCase()) && category.subcategories.length > 0 && (
                          <div className="ps-4 mt-2" style={{
                            maxHeight: '200px',
                            opacity: 1,
                            transition: 'max-height 0.7s ease-in-out, opacity 0.3s ease-in-out',
                          }}>
                            {category.subcategories.map((subcat) => (
                              <div key={subcat.name} className="form-check d-flex justify-content-between mb-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                  <input
                                    className="form-check-dark rounded custom-checkbox"
                                    type="checkbox"
                                    id={`desktop-subcat-${subcat.name}`}
                                    style={{height:"20px", width:"40px" }}
                                    checked={selectedSubcategories.includes(subcat.name.toLowerCase())}
                                    onChange={() => handleSubcategoryChange(subcat.name)}
                                  />
                                  <label className="form-check-label" htmlFor={`desktop-subcat-${subcat.name}`}>
                                    {subcat.name}
                                  </label>
                                </div>
                                <span className="text-muted">({subcat.count})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className='mb-3' />

              {/* Stock Filter */}
              <div className="filter-section mb-3">
                <div 
                  className="filter-header d-flex justify-content-between align-items-center p-2"
                  onClick={() => toggleSection('stock')}
                  style={{ cursor: 'pointer', borderRadius: '4px', }}
                >
                  <h6 className="m-0 fw-bold">AVAILABILITY</h6>
                  <div className="d-flex align-items-center">
                    <span 
                      className="reset-text me-2" 
                      onClick={(e) => { e.stopPropagation(); resetFilter('stock'); }}
                      style={{ fontSize: '12px', color: '#6c757d', cursor: 'pointer' }}
                    >
                      RESET
                    </span>
                    <span style={chevronStyle(expandedSections.stock)}><Icon icon="solar:alt-arrow-down-line-duotone" width="24" height="24" /></span>
                  </div>
                </div>
                
                <div style={filterContentStyle(expandedSections.stock)}>
                  <div className="filter-body p-2">
                    <div className="form-check d-flex justify-content-between align-items-center">
                      <div className='d-flex justify-content-between align-items-center'>
                        <input
                          className="form-check-dark rounded custom-checkbox"
                          style={{height:"20px", width:"40px" }}                          
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={() => setInStockOnly(!inStockOnly)}
                          id="desktop-stockCheck"
                        />
                        <label className="form-check-label" htmlFor="desktop-stockCheck">
                          In Stock Only
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear All Filters Button */}
              <button
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={resetAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* -------------------------------------- */}
          <div className="shop-right col-12 col-lg-9 p-0">
            <div className=" container w-100 d-flex   justify-content-between align-items-center mb-3">
              {/* Mobile Filter Button with animation */}
              <div 
                onClick={handlerFilterToggle} 
                className="filter-toggle-btn  d-flex d-lg-none gap-2 align-items-center rounded filter-btn"
              >
                <Icon icon="mi:filter" width="30" height="30" />
                <p className="m-0">FILTER</p>
              </div>
            <h5 className='product-showed pb-1'>Showing <span className='text-success'>{filteredProducts.length}</span> product(s)</h5>
            </div>




            <div className="container">
              <div className="row m-0 p-0">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    funId={product.id}
                    id={product.documentId}
                    thumbnail={product.thumbnail?.url}
                    productName={product.product_name}
                    rating={product.product_rating}
                    productPrice={product.product_price}
                    hasDiscount={product.hasDiscount}
                    discountValue={product.discount_value}
                    category={product.categories.category_name}
                    img={product.image}
                  />
                ))}
              </div>
            </div>
            
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav aria-label="Product pagination" className="mt-4">
              <ul className="pagination justify-content-center align-items-center">
                
                {/* Previous Arrow */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="arrow-btn custom-pagination"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <Icon icon="ic:round-arrow-left" width="24" height="24" />
                  </button>
                </li>
          
                {/* Numbered Pages */}
                {[...Array(totalPages).keys()].map(number => (
                  <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                    <button
                      className=" custom-pagination"
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
          
                {/* Next Arrow */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="arrow-btn custom-pagination"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <Icon icon="ic:round-arrow-right" width="24" height="24" />
                  </button>
                </li>
          
              </ul>
            </nav>
          )}
          </div>
        </div>
      </div>


      <div data-aos="fade-up" data-aos-duration="3000" className="features-section">
      <div className="featuers row px-1 g-3">
        <div className="feature-card col-12 col-md-6 col-lg-3 d-flex justify-content-between align-items-center gap-3">
          <div className=" w-25">
          <Icon className='feature-icon hover-shake rounded-circle d-flex justify-content-center align-items-center' icon="game-icons:truck" width="22" height="22" />
          </div>
          <div className="d-flex flex-column gap-2 w-75">
          <p className="feature-title mb-0 fw-bold">Free Shipping</p>
          <p className="feature-text text-secondary mb-0">Delivering Value, Delivering Savings: Free Shipping on Every Order, Every Time</p>
          </div>
        </div>

        <div className="feature-card col-12 col-md-6 col-lg-3 d-flex justify-content-between align-items-center gap-3">
          <div className="w-25">
          <Icon className='feature-icon hover-shake rounded-circle d-flex justify-content-center align-items-center' icon="hugeicons:delivery-return-01" width="22" height="22" />
          </div>
          <div className="d-flex flex-column gap-2 w-75">
          <p className="feature-title mb-0 fw-bold">Return Policy</p>
          <p className="feature-text text-secondary mb-0">Shop with Confidence: Our Customer-Centric Return Policy Ensures</p>
          </div>
        </div>

        <div className="feature-card col-12 col-md-6 col-lg-3 d-flex justify-content-between align-items-center gap-3">
          <div className="w-25">
          <Icon className='feature-icon hover-shake rounded-circle d-flex justify-content-center align-items-center' icon="streamline:payment-10" width="22" height="22" />
          </div>
          <div className="d-flex flex-column gap-2 w-75">
          <p className="feature-title mb-0 fw-bold">Payment Secured</p>
          <p className="feature-text text-secondary mb-0">Trustworthy Payment Solutions: Robust Protocols to Ensure Your Transactions</p>
          </div>
        </div>

        <div className="feature-card col-12 col-md-6 col-lg-3 d-flex justify-content-between align-items-center gap-3">
          <div className="w-25">
          <Icon className='feature-icon hover-shake rounded-circle d-flex justify-content-center align-items-center' icon="mdi:recurring-payment" width="22" height="22" />
          </div>
          <div className="d-flex flex-column gap-2 w-75">
          <p className="feature-title mb-0 fw-bold">Money Back Guarantee</p>
          <p className="feature-text text-secondary mb-0">We Stand by Our Promise: Our Money Back Guarantee Ensures Your...</p>
          </div>
        </div>
      </div>
      </div>
      
    </div>
  )
}