// Header.js
import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../App.css'
// import Search from './Search'
import axios from 'axios'
import { logout, getUser } from '../../utils/helpers'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const [user, setUser] = useState({})
    const navigate = useNavigate()
    const logoutUser = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`)
            setUser({})
            logout(() => navigate('/'))
        } catch (error) {
            toast.error(error.response.data.message)

        }
    }
    const logoutHandler = () => {
        logoutUser();
        toast.success('log out', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
    useEffect(() => {
        setUser(getUser())
    }, [])

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
            <Link to="/login" className="btn ml-4" id="login_btn">Login</Link> 
            <Link className="btn ml-4" id="profile_btn" to="/me">Profile</Link>
            <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>Logout</Link>       
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;