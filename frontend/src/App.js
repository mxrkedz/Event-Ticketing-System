import React, { useState } from 'react';
import Header from './Components/Layout/Header';
import Home from './Components/Home';
import Footer from './Components/Layout/Footer';
import Dashboard from './Components/Admin/Dashboard';
import EventDetails from './Components/EventTicket/EventDetails';
import Login from "./Components/User/Login";
import Register from './Components/User/Register';
import Profile from "./Components/User/Profile";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';

function App() {

  const [state, setState] = useState({
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  })
  const addItemToCart = async (id, quantity) => {
    console.log(id, quantity)
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/event/${id}`)
      const item = {
        event: data.event._id,
        name: data.event.name,
        image: data.event.images[0].url,
      }

      const isItemExist = state.cartItems.find(i => i.event === item.event)
      console.log(isItemExist, state)
      // setState({
      //   ...state,
      //   cartItems: [...state.cartItems, item]
      // })
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i => i.event === isItemExist.event ? item : i)
        })
      }
      else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item]
        })
      }

      toast.success('Item Added to Cart', {
        position: toast.POSITION.BOTTOM_RIGHT
      })

    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT
      });
      // navigate('/')
    }

  }
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/event/:id" element={<EventDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
        </Routes>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
