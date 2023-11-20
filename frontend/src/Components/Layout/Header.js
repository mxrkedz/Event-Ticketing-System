import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import { logout, getUser } from '../../utils/helpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({ cartItems }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axios.get(`http://localhost:4001/api/v1/logout`);
      setUser({});
      logout(() => navigate('/'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const logoutHandler = () => {
    logoutUser();
    toast.success('Logged out', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    setTimeout(() => {
      window.location.reload();
    }, 0);
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Ensure cartItems is defined before accessing its length
  const cartItemCount = cartItems ? cartItems.length : 0;

  console.log("cartItems:", cartItems);
  return (
    <Fragment>
      <nav className="navbar row">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="col-12 col-md-3">
            <div className="navbar-brand">
              <img src="/logo.png" alt="Logo" style={{ width: '200px', height: 'auto' }} />
            </div>
          </div>
        </Link>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <h3>Search Area ..................</h3>
          {/* <Search /> */}
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <Link to="/" style={{ textDecoration: 'none' }}>
            <span id="cart" className="ml-3">
              Home
            </span>
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <span id="cart" className="ml-3">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItemCount}
            </span>
          </Link>
          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link
                to="#!"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user && user.name}</span>
              </Link>

              <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                {user && user.role === 'admin' && <Link className="dropdown-item" to="/dashboard">Dashboard</Link>}
                <Link className="dropdown-item" to="/orders/me">
                  Orders
                </Link>
                <Link className="dropdown-item" to="/me">
                  Profile
                </Link>

                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn ml-4" id="login_btn">
              Login
            </Link>
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;
