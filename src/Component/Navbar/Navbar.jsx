import React from 'react';
import './Navbar.css';
import { FiSearch, FiShoppingBag } from 'react-icons/fi';

function Navbar() {
  return (
    <div className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-left'>
          <a href='#' className='nav-link active'>New Arrival</a>
          <a href='#' className='nav-link'>All Product</a>
          <a href='#' className='nav-link'>Blog</a>
          <a href='#' className='nav-link'>Contact Us</a>
        </div>
        
        <div className='navbar-center'>
          <h1 className='logo'>Fika</h1>
        </div>
        
        <div className='navbar-right'>
          <div className='search-bar'>
            <input type='text' placeholder='Search Product...' />
            <button className='search-button'>
              <FiSearch />
            </button>
          </div>
          <div className='cart-icon'>
            <FiShoppingBag />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
