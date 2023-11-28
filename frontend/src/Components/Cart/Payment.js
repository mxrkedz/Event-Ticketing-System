import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../utils/helpers";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const Payment = ({ cartItems, shippingInfo }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const createOrder = async (order) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/order/new`,
        order,
        config
      );
      toast.success("Order created", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      window.location.reload();
      navigate("/success");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!cardNumber || !/^[0-9]{16}$/.test(cardNumber)) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "Please enter a valid expiration date (MM/YY)";
    }

    if (!cardCVC || !/^[0-9]{3}$/.test(cardCVC)) {
      errors.cardCVC = "Please enter a valid 3-digit CVC code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      document.querySelector("#pay_btn").disabled = true;
      order.paymentInfo = {
        id: "pi_1DpdYh2eZvKYlo2CYIynhU32",
        status: "succeeded",
      };
      createOrder(order);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Payment"} />
      <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper" style={{ marginBottom: "10.2%" }}>
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <input
                type="text"
                id="card_num_field"
                className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="XXXX XXXXXX XXXXX"
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/, ""))
                }
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                
              />
              {formErrors.cardNumber && (
                <div className="invalid-feedback">{formErrors.cardNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <input
                type="text"
                id="card_exp_field"
                className={`form-control ${formErrors.cardExpiry ? 'is-invalid' : ''}`}
                pattern="\d{2}/\d{2}"
                inputMode="numeric"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                
              />
              {formErrors.cardExpiry && (
                <div className="invalid-feedback">{formErrors.cardExpiry}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <div className="cvc-input-container">
                <input
                  type="text"
                  id="card_cvc_field"
                  className={`form-control ${formErrors.cardCVC ? 'is-invalid' : ''}`}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="***"
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/, ""))
                  }
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value)}
                  
                />
                <div className="delete-icon-container">
                  <Tooltip title="Please copy your CVV/CVC code from the back of your card and continue with your payment.">
                    <IconButton>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {formErrors.cardCVC && (
                <div className="invalid-feedback">{formErrors.cardCVC}</div>
              )}
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {` - ₱${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
