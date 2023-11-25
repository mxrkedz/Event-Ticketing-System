import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import MetaData from "../Layout/MetaData";
import Loader from "../Layout/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { getToken } from "../../utils/helpers";

const OrderDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState({});

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;
  let { id } = useParams();

  const getOrderDetails = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/${id}`,
        config
      );
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    getOrderDetails(id);

    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, id]);

  const shippingDetails = shippingInfo && ` ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  return (
    <Fragment>
      <MetaData title={"Order Details"} />

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="order-container">
            <div className="order-details card " style={{ padding: "15px" }}>
              <h1 className="my-3">
                <b>Order #</b> {order._id}
              </h1>
              <hr />

              <h4 className="mb-3">
                <b>Shipping Info</b>
              </h4>
              <p className="mb-2">
                <b>Name:</b> {user && user.name}
              </p>
              <p className="mb-2">
                <b>Phone No.:</b> {shippingInfo && shippingInfo.phoneNo}
              </p>
              <p className="mb-2">
                <b>Address:</b>
                {shippingDetails}
              </p>
              <p className="mb-2">
                <b>Amount:</b> ${totalPrice}
              </p>

              <hr />

              <h4 className="mb-3">
                <b>Order Tracking</b>
              </h4>
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-column mr-4">
                  <h4 className="my-2">Payment Status:</h4>
                  <p className={isPaid ? "greenColor" : "redColor"}>
                    <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                  </p>
                </div>

                <div className="d-flex flex-column mr-auto">
                  <h4 className="mt-2">Order Status:</h4>
                  <p
                    className={
                      order.orderStatus &&
                      String(order.orderStatus).includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderStatus}</b>
                  </p>
                </div>
              </div>
              <hr/>

              <h4 className="mb-3">
                <b>Ordered Ticket(s):</b>
              </h4>

              <div className="cart-item my-1">
  <div className="row my-3">
    <div className="col-4 col-lg-2">
      <h4 className="mb-2"><b>Image</b></h4>
    </div>
    <div className="col-5 col-lg-4">
      <h4 className="mb-2"><b>Name</b></h4>
    </div>
    <div className="col-4 col-lg-2">
      <h4 className="ml-4 mb-2"><b>Price</b></h4>
    </div>
    <div className="col-4 col-lg-3">
      <h4 className="ml-4 mb-2"><b>Quantity</b></h4>
    </div>
  </div>

  {orderItems &&
    orderItems.map((item) => (
      <div key={item.product} className="row my-5">
        <div className="col-4 col-lg-2">
          <Link to={`/event/${item.event}`}>
            <img
              src={item.image}
              alt={item.name}
              height="100"
              width="100"
            />
          </Link>
        </div>

        <div className="col-5 col-lg-4">
          <Link to={`/event/${item.event}`} style={{ fontSize: '22px' }}>
            {item.name}
          </Link>
        </div>

        <div className="col-4 col-lg-2">
          <p style={{ fontSize: '22px' }}>${item.price}</p>
        </div>

        <div className="col-4 col-lg-3">
          <p style={{ fontSize: '22px' }}>{item.quantity} Ticket(s)</p>
        </div>
      </div>
    ))}
</div>

              <hr />
            </div>
          </div>
          <div className="container w-500" style={{ marginBottom: "5%" }}>
              <div className="text-center">
                <p>
                  <Link to={`/`} id="edit_profile" className="btn card__btn-contact">
                    Return Home <ArrowForwardIcon />
                  </Link>
                </p>
              </div>
              </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
