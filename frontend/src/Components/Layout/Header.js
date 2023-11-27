import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import Search from "./Search";
import axios from "axios";
import { logout, getUser } from "../../utils/helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import SpeedIcon from "@mui/icons-material/Speed";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FeedIcon from "@mui/icons-material/Feed";

const Header = ({ cartItems }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axios.get(`http://localhost:4001/api/v1/logout`);
      setUser({});
      logout(() => navigate("/"));
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const logoutHandler = () => {
    logoutUser();
    toast.success("Logged out", {
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
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="col-12 col-md-3">
            <div className="navbar-brand">
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          </div>
        </Link>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>

        <div className="col-12 col-md-4 mt-4 mt-md-0 text-center">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-1">
              <HomeIcon /> Home
            </span>
          </Link>
          <Link to="/news" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-4">
              <FeedIcon /> News
            </span>
          </Link>
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-4">
              <Badge badgeContent={cartItemCount} color="error" showZero>
                <ShoppingCartIcon />
              </Badge>
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

              <div
                className="dropdown-menu mt-3 ml-3"
                aria-labelledby="dropDownMenuButton"
              >
                {user && user.role === "admin" && (
                  <Link
                    style={{ color: "goldenrod" }}
                    className="dropdown-item"
                    to="/dashboard"
                  >
                    <SpeedIcon /> Dashboard
                  </Link>
                )}
                <Link className="dropdown-item" to="/orders/me">
                  <ShoppingBasketIcon /> Orders
                </Link>
                <Link className="dropdown-item" to="/me">
                  <PersonIcon /> Profile
                </Link>

                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  <LogoutIcon /> Logout
                </Link>
              </div>
            </div>
          ) : (
            <Fragment>
              <Link
                to="/login"
                className="btn ml-4"
                id="login_btn"
                style={{ color: "white", border: "3px solid #904E55", backgroundColor: "#252627"}}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn ml-2"
                id="login_btn"
                style={{ color: "white" }}
              >
                Register
              </Link>
            </Fragment>
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;
