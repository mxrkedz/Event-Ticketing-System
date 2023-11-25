import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { getUser } from "../../utils/helpers";
import PaymentsIcon from '@mui/icons-material/Payments';
const ConfirmOrder = ({ cartItems, shippingInfo }) => {
  const [user, setUser] = useState(getUser() ? getUser() : {});
  let navigate = useNavigate();
  // Calculate Order Prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const processToPayment = () => {
    const data = {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  return (
    <Fragment>
      <MetaData title={"Confirm Order"} />
      <CheckoutSteps shipping confirmOrder />
      <div className="container">
        <div
          className="row d-flex justify-content-between"
          style={{ marginBottom: "15.2%" }}
        >
          <div className="col-12 col-lg-8 mt-5 order-confirm">
            <div id="order_summary" style={{ width: "auto" }}>
              <h2 className="mb-3">Shipping Info</h2>
              <hr />
              {getUser() && (
                <p>
                  <b>Name:</b> {user && user.name}
                </p>
              )}
              {getUser() && (
                <p>
                  <b>Email:</b> {user && user.email}
                </p>
              )}
              <p>
                <b>Phone:</b> {shippingInfo.phoneNo}
              </p>
              <p>
                <b>Country:</b> {shippingInfo.country}
              </p>
            </div>
            <br />
            <div id="order_summary" style={{ width: "auto" }}>
              <h3>Your Cart Items:</h3>

              {cartItems.map((item) => (
                <Fragment key={item.event}>
                  <hr />
                  <div className="cart-item my-1">
                    <div className="row">
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="100"
                          width="100"
                        />
                      </div>
                      <div className="col-5 col-lg-6">
                        <Link to={`/event/${item.event}`}>{item.name}</Link>
                      </div>
                      <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                        <p>
                          {item.quantity} x ₱{item.price} ={" "}
                          <b>₱{(item.quantity * item.price).toFixed(2)}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-3 my-5">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>
                Subtotal:{" "}
                <span className="order-summary-values">₱{itemsPrice}</span>
              </p>
              <p>
                Shipping:{" "}
                <span className="order-summary-values">₱{shippingPrice}</span>
              </p>
              <p>
                Tax: <span className="order-summary-values">₱{taxPrice}</span>
              </p>
              <hr />
              <p>
                Total:{" "}
                <span className="order-summary-values">₱{totalPrice}</span>
              </p>
              <hr />
              <button
                id="checkout_btn"
                className="btn btn-primary btn-block"
                onClick={processToPayment}
              >
                Proceed to Payment <PaymentsIcon/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
