import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Cart = ({ updateCart, cartItems, removeItemFromCart }) => {
  const navigate = useNavigate();

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) return;
    updateCart(id, newQty);
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    updateCart(id, newQty);
  };

  const removeCartItemHandler = (id) => {
    removeItemFromCart(id);
  };
  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  return (
    <Fragment>
      <MetaData title={"Your Cart"} />
      {cartItems.length === 0 ? (
          <div className="container" style={{ marginBottom: '35.9%' }}>

  <h2 className="mt-5 text-center">Your Cart is Empty!</h2>
  <p className="text-center"><Link to={`/`}>Continue Shopping <ArrowForwardIcon/></Link>
  </p>

  </div>
) : (
  <Fragment>
  <MetaData title={"Your Cart"} />
  <div className="container" style={{ marginBottom: '20%' }}>
    {cartItems.length === 0 ? (
      <div className="text-center mt-5">
        <h2>Your Cart is Empty!</h2>
        <p>
          <Link to={`/`} className="btn btn-primary">
            Continue Shopping <ArrowForwardIcon />
          </Link>
        </p>
      </div>
    ) : (
      <Fragment>
        <h2 className="mt-5">
          Your Cart: <b>{cartItems.length} items</b>
        </h2>

        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8">
            {cartItems.map((item) => (
              <Fragment key={item.event}>
                <hr />
                <div className="cart-item">
                  <div className="row">
                    <div className="col-4 col-lg-3">
                      <img src={item.image} alt="Event" height="150" width="auto" />
                    </div>

                    <div className="col-5 col-lg-3">
                      <Link to={`/event/${item.event}`}>{item.name}</Link>
                    </div>

                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p id="card_item_price">${item.price}</p>
                    </div>

                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <div className="stockCounter d-inline">
                        <span
                          className="btn btn-danger minus"
                          onClick={() => decreaseQty(item.event, item.quantity)}
                        >
                          -
                        </span>

                        <input
                          type="number"
                          className="form-control count d-inline"
                          value={item.quantity}
                          readOnly
                        />

                        <span
                          className="btn btn-primary plus"
                          onClick={() => increaseQty(item.event, item.quantity, item.stock)}
                        >
                          +
                        </span>
                      </div>
                    </div>

                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                      <i
                        id="delete_cart_item"
                        className="fa fa-trash btn btn-danger"
                        onClick={() => removeCartItemHandler(item.event)}
                      ></i>
                    </div>
                  </div>
                </div>
                <hr />
              </Fragment>
            ))}
          </div>

          <div className="col-12 col-lg-3 my-4">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>
                Subtotal:{" "}
                <span className="order-summary-values">
                  {cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)} (Units)
                </span>
              </p>
              <p>
                Est. total:{" "}
                <span className="order-summary-values">
                  ${cartItems
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
                </span>
              </p>
              <hr />
              <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>
                Check out
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    )}
  </div>

  <ToastContainer />
</Fragment>)}

      <ToastContainer />
    </Fragment>
  );
};

export default Cart;
