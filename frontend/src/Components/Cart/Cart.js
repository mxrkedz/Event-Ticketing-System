import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

const Cart = ({ updateCart, cartItems, removeItemFromCart, clearCart }) => {
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
  const clearCartHandler = () => {
    clearCart();
    toast.success("Cart Cleared!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const checkoutHandler = () => {
    // Check if any item quantity is less than 1
    const isQuantityValid = cartItems.every((item) => item.quantity >= 1);

    if (isQuantityValid) {
      navigate("/login?redirect=shipping");
    } else {
      toast.error(
        "Please ensure all items have a quantity greater than or equal to 1",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }
  };
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  return (
    <Fragment>
      <MetaData title={"Your Cart"} />
      {cartItems.length === 0 ? (
        <div className="container" style={{ marginBottom: "35.9%" }}>
          <h2 className="mt-5 text-center">Your Cart is Empty!</h2>
          <p className="text-center">
            <Link to={`/`}>
              Continue Shopping <ArrowForwardIcon />
            </Link>
          </p>
        </div>
      ) : (
        <Fragment>
          <MetaData title={"Your Cart"} />
          <div className="container w-500" style={{ marginBottom: "20%" }}>
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
                              <img
                                src={item.image}
                                alt="Event"
                                height="150"
                                width="150"
                              />
                            </div>

                            <div className="col-5 col-lg-3">
                              <p>
                                <Link to={`/event/${item.event}`}>
                                  {item.name}
                                </Link>
                              </p>
                            </div>

                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                              <p id="card_item_price">${item.price}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                              <div className="stockCounter d-inline">
                                <span
                                  className="btn btn-danger minus"
                                  onClick={() =>
                                    decreaseQty(item.event, item.quantity)
                                  }
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
                                  onClick={() =>
                                    increaseQty(
                                      item.event,
                                      item.quantity,
                                      item.stock
                                    )
                                  }
                                >
                                  +
                                </span>
                              </div>
                            </div>

                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                              <DeleteIcon
                                id="delete_cart_item"
                                onClick={() =>
                                  removeCartItemHandler(item.event)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <hr />
                      </Fragment>
                    ))}
                    <button
                      id="clear_cart_btn"
                      className="btn btn-danger"
                      onClick={clearCartHandler}
                    >
                      <DeleteIcon /> Clear Cart
                    </button>
                  </div>

                  <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                      <h4>Order Summary</h4>
                      <hr />
                      <p>
                        Subtotal:{" "}
                        <span className="order-summary-values">
                          {cartItems.reduce(
                            (acc, item) => acc + Number(item.quantity),
                            0
                          )}{" "}
                          (Units)
                        </span>
                      </p>
                      <p>
                        Est. total:{" "}
                        <span className="order-summary-values">
                          $
                          {cartItems
                            .reduce(
                              (acc, item) => acc + item.quantity * item.price,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </p>
                      <hr />
                      <button
                        id="checkout_btn"
                        className={`btn btn-primary btn-block ${
                          cartItems.every((item) => item.quantity >= 1)
                            ? ""
                            : "disabled"
                        }`}
                        onClick={checkoutHandler}
                        disabled={
                          !cartItems.every((item) => item.quantity >= 1)
                        }
                      >
                        <ShoppingCartCheckoutIcon/> Check out
                      </button>
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
          </div>

          <ToastContainer />
        </Fragment>
      )}

      <ToastContainer />
    </Fragment>
  );
};

export default Cart;
