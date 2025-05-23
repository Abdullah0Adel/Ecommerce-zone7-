import React, { useState } from 'react';

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
}) {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories = ['football jerseys'];
  const subcategories = ['player edition', 'fan edition', 'winter Collection'];

  const handleSubcategoryChange = (value) => {
    if (selectedSubcategories.includes(value)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== value));
    } else {
      setSelectedSubcategories([...selectedSubcategories, value]);
    }
  };

  return (
    <div className="product-filters">
      <h5>Filter by Category</h5>

      <div className="dropdown mb-3">
        <button
          className="btn btn-outline-primary dropdown-toggle"
          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
        >
          {selectedCategory || 'Select Category'}
        </button>

        {categoryDropdownOpen && (
          <div className="dropdown-menu show p-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className="dropdown-item"
                onClick={() => {
                  setSelectedCategory(cat === selectedCategory ? '' : cat);
                  setSelectedSubcategories([]); // reset subcategories on change
                  setCategoryDropdownOpen(false);
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCategory === 'football jerseys' && (
        <div>
          <h6>Subcategories</h6>
          {subcategories.map(sub => (
            <div key={sub} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={sub}
                checked={selectedSubcategories.includes(sub)}
                onChange={() => handleSubcategoryChange(sub)}
              />
              <label className="form-check-label" htmlFor={sub}>
                {sub}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
