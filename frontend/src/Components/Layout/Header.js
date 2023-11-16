// Header.js
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css'

const Header = () => {

  return (
    <Fragment>
      <nav className="navbar row">
          <div className="col-12 col-md-3">
            <div className="navbar-brand">
            <Link to="/">
              <img src="./mmdns2.png" alt="Logo" style={{ width: '100px', height: 'auto' }} />
            </Link>
            </div>
          </div>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {/* <Search /> */}
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/">
          <span id="home" className="ml-3"  style={{ color: 'white' }}>Home</span>
          </Link>
            <span id="categories" className="ml-3"  style={{ color: 'white' }}>Categories</span>
            <span id="profile" className="ml-3"  style={{ color: 'white' }}>Profile</span>
            <span id="cart" className="ml-3"  style={{ color: 'white' }}>Cart</span>
            <span className="ml-1" id="cart_count">1</span>        
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;