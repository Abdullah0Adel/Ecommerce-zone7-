import React, { createContext, useState, useContext, useEffect } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  // All state from Shop.jsx that needs to persist
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    stock: true
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('shopFilters');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setSelectedCategories(parsedState.selectedCategories || []);
        setSelectedSubcategories(parsedState.selectedSubcategories || []);
        setInStockOnly(parsedState.inStockOnly || false);
        setPriceRange(parsedState.priceRange || [0, 5000]);
        setCurrentPage(parsedState.currentPage || 1);
        setExpandedSections(parsedState.expandedSections || {
          price: true,
          categories: true,
          stock: true
        });
      }
    } catch (error) {
      console.error("Error loading shop state:", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        selectedCategories,
        selectedSubcategories,
        inStockOnly,
        priceRange,
        currentPage,
        expandedSections
      };
      localStorage.setItem('shopFilters', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving shop state:", error);
    }
  }, [selectedCategories, selectedSubcategories, inStockOnly, priceRange, currentPage, expandedSections]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setInStockOnly(false);
    setPriceRange([0, 5000]);
    setCurrentPage(1);
  };
  const resetPagination = () => {
    setCurrentPage(1);
  }

  // Reset specific filter
  const resetFilter = (filterType) => {
    switch(filterType) {
      case 'price':
        setPriceRange([0, 5000]);
        break;
      case 'categories':
        setSelectedCategories([]);
        setSelectedSubcategories([]);
        break;
      case 'stock':
        setInStockOnly(false);
        break;
      default:
        break;
    }
  };

  // Toggle section expansion
const toggleSection = (section) => {
  setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
};


  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category.toLowerCase())) {
        return prevSelected.filter(cat => cat !== category.toLowerCase());
      } else {
        return [...prevSelected, category.toLowerCase()];
      }
    });
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategories(prevSelected => {
      if (prevSelected.includes(subcategory.toLowerCase())) {
        return prevSelected.filter(sub => sub !== subcategory.toLowerCase());
      } else {
        return [...prevSelected, subcategory.toLowerCase()];
      }
    });
  };

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const value = {
    selectedCategories,
    selectedSubcategories,
    inStockOnly,
    priceRange,
    currentPage,
    expandedSections,
    setSelectedCategories,
    setSelectedSubcategories,
    setInStockOnly,
    setPriceRange,
    setCurrentPage,
    resetAllFilters,
    resetFilter,
    toggleSection,
    handleCategoryChange,
    handleSubcategoryChange,
    paginate,
    resetPagination
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};