import React, { useState } from "react";
import Header from "./Components/Layout/Header";
import Home from "./Components/Home";
import Footer from "./Components/Layout/Footer";
import Dashboard from "./Components/Admin/Dashboard";
import EventDetails from "./Components/EventTicket/EventDetails";
import Login from "./Components/User/Login";
import Register from "./Components/User/Register";
import Profile from "./Components/User/Profile";
import UpdateProfile from "./Components/User/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ForgotPassword from "./Components/User/ForgotPassword";
import NewPassword from "./Components/User/NewPassword";
import Cart from "./Components/Cart/Cart";
import Shipping from "./Components/Cart/Shipping";
import OrderSuccess from "./Components/Cart/OrderSuccess";
import ConfirmOrder from "./Components/Cart/ConfirmOrder";
import Payment from "./Components/Cart/Payment";
import EventsList from "./Components/Admin/EventsList";
import PostsList from "./Components/Admin/PostsList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import OrdersList from "./Components/Admin/OrdersList";
import UsersList from "./Components/Admin/UsersList";
import UpdateUser from "./Components/Admin/UpdateUser";
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import ProcessOrder from "./Components/Admin/ProcessOrder";
import ListOrders from "./Components/Order/ListOrders";
import OrderDetails from "./Components/Order/OrderDetails";
import NewEvent from "./Components/Admin/NewEvent";
import UpdateEvent from "./Components/Admin/UpdateEvent";
import NewPost from "./Components/Admin/NewPost";
import UpdatePost from "./Components/Admin/UpdatePost";
import ListPosts from "./Components/Post/ListPosts";
import PostDetails from "./Components/Post/PostDetails";

function App() {
  const [state, setState] = useState({
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  });

  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter((i) => i.event !== id),
    });
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  };

  const clearCart = () => {
    setState({
      ...state,
      cartItems: [], // Set the cartItems to an empty array
    });
  
    // Update the localStorage with the modified cartItems (empty array)
    localStorage.setItem("cartItems", JSON.stringify([]));
  };  

  const addItemToCart = async (id, quantity) => {
    console.log(id, quantity);
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/event/${id}`
      );
      const item = {
        event: data.event._id,
        name: data.event.name,
        price: data.event.price,
        image: data.event.images[0].url,
        stock: data.event.stock,
        quantity: quantity,
      };

      const isItemExist = state.cartItems.find((i) => i.event === item.event);
      console.log(isItemExist, state);
      // setState({
      //   ...state,
      //   cartItems: [...state.cartItems, item]
      // })
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.event === isItemExist.event ? item : i
          ),
        });
      } else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item],
        });
      }

      toast.success("Item Added to Cart", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
      // navigate('/')
    }
  };
  const saveShippingInfo = async (data) => {
    setState({
      ...state,
      shippingInfo: data,
    });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };

  const updateCart = async (id, quantity) => {
    console.log(id, quantity);
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/event/${id}`
      );
      const item = {
        event: data.event._id,
        name: data.event.name,
        price: data.event.price,
        image: data.event.images[0].url,
        stock: data.event.stock,
        quantity: quantity,
      };

      const isItemExist = state.cartItems.find((i) => i.event === item.event);
      console.log(isItemExist, state);
      // setState({
      //   ...state,
      //   cartItems: [...state.cartItems, item]
      // })
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.event === isItemExist.event ? item : i
          ),
        });
      } else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item],
        });
      }

      toast.success("Item Updated Succesfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
      // navigate('/')
    }
  };

  return (
    <div className="App">
      <Router>
        <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:id"
            element={
              <EventDetails
                cartItems={state.cartItems}
                addItemToCart={addItemToCart}
              />
            }
            exact="true"
          />
          <Route path="/search/:keyword" element={<Home />} exact="true" />

          {/* Transaction */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={state.cartItems}
                addItemToCart={addItemToCart}
                updateCart={updateCart}
                removeItemFromCart={removeItemFromCart}
                clearCart={clearCart}
              />
            }
            exact="true"
          />

          <Route
            path="/shipping"
            element={
              <Shipping
                shipping={state.shippingInfo}
                saveShippingInfo={saveShippingInfo}
              />
            }
          />
          <Route
            path="/confirm"
            element={
              <ConfirmOrder
                cartItems={state.cartItems}
                shippingInfo={state.shippingInfo}
              />
            }
          />
          <Route
            path="/payment"
            element={
              <Payment
                cartItems={state.cartItems}
                shippingInfo={state.shippingInfo}
              />
            }
          />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders/me" element={<ListOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          {/* Transaction End */}

          {/* Auth */}
          
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />
          <Route path="/password/update" element={<UpdatePassword />} />          
          <Route path="/password/reset/:token" element={<NewPassword />} exact="true" />
          <Route path="/password/forgot" element={<ForgotPassword />} exact="true" />
          {/* Auth End*/}

          <Route
            path="/admin/events"
            element={
              <ProtectedRoute isAdmin={true}>
                <EventsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAdmin={true}>
                <OrdersList />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/event" element={<NewEvent />} />
          <Route path="/admin/event/:id" element={<UpdateEvent />} />

          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute isAdmin={true}>
                <PostsList />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/post" element={<NewPost />} />
          <Route path="/admin/post/:id" element={<UpdatePost />} />
          <Route path="/news" element={<ListPosts />} exact="true" />
          <Route
            path="/post/:id"
            element={
              <PostDetails/>
            }
            exact="true"
          />
          
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
