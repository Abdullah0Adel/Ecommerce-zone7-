// Breadcrumbs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const isSingleProductPage = 
    (pathnames[0] === 'products' && pathnames.length === 2) || 
    (pathnames[0] === 'product' && pathnames.length === 2);
  
  if (pathnames.length === 0 || isSingleProductPage) {
    return null;
  }
  
  return (
    <div className="breadcrumbs fw-bold">
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        
        return (
          <React.Fragment key={name}>
            <span className="separator"> &gt; </span>
            {isLast ? (
              <span className="current-page">{displayName}</span>
            ) : (
              <Link to={routeTo}>{displayName}</Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;