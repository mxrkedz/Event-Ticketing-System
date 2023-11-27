import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import Loader from "../Layout/Loader";
import Sidebar from "./SideBar";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";

const ProcessOrder = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  let navigate = useNavigate();

  let { id } = useParams();
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;
  const orderId = id;
  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

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
  const updateOrder = async (id, formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      formData.status = status;
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/admin/order/${id}`,
        formData,
        config
      );
      setIsUpdated(data.success);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    getOrderDetails(orderId);
    if (error) {
      errMsg(error);
      setError("");
    }
    if (isUpdated) {
      successMsg("Order updated successfully");
      setIsUpdated("");
      navigate("/admin/orders");
    }
  }, [error, isUpdated, orderId]);

  const updateOrderHandler = (id) => {
    const formData = new FormData();
    formData.set("status", status);
    updateOrder(id, formData);
  };

  const shippingDetails = shippingInfo && ` ${shippingInfo.country}`;
  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "redColor";
      case "Processing":
        return "blueColor";
      case "Shipped":
        return "yellowColor";
      case "Delivered":
        return "greenColor";
      default:
        return "redColor";
    }
  };
  return (
    <Fragment>
      <MetaData title={`Process Order # ${order && order._id}`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            {loading ? (
              <Loader />
            ) : (
              <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-7 order-details">
                  <h2 className="my-5">
                    <b>Order #</b>
                    {order._id}
                  </h2>
                  <h4 className="mb-4">
                    <b>Shipping Info</b>
                  </h4>
                  <p className="mb-2">
                    <b>Name:</b> {user && user.name}
                  </p>
                  <p className="mb-2">
                    <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
                  </p>
                  <p className="mb-2">
                    <b>Address:</b>
                    {shippingDetails}
                  </p>
                  <p>
                    <b>Amount:</b> ₱{totalPrice}
                  </p>
                  <hr />
                  <h4 className="my-4">Payment</h4>
                  <p className={isPaid ? "greenColor" : "redColor"}>
                    <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                  </p>
                  <h4 className="my-4">Stripe ID</h4>
                  <p>
                    <b>{paymentInfo && paymentInfo.id}</b>
                  </p>
                  <h4 className="my-4">Order Status:</h4>
                  <p className={getStatusColorClass(orderStatus)}>
                    <b>{orderStatus}</b>
                  </p>{" "}
                  <h4 className="my-4">Order Items:</h4>
                  <hr />
                  <div className="cart-item my-1">
                    {orderItems &&
                      orderItems.map((item) => (
                        <div key={item.event} className="row my-5">
                          <div className="col-4 col-lg-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              height="100"
                              width="100"
                            />
                          </div>

                          <div className="col-5 col-sm-3">
                            <Link to={`/events/${item.event}`}>
                              {item.name}
                            </Link>
                          </div>
                          <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                            <p>${item.price}</p>
                          </div>
                          <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                            <p>{item.quantity} Piece(s)</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <hr />
                </div>
                <div className="col-12 col-lg-3 mt-5">
                  <h4 className="my-4">Status</h4>
                  <div className="form-group">
                    <select
                      className="form-control"
                      name="status"
                      value={status}
                      placeholder="Set Status"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => updateOrderHandler(order._id)}
                    disabled={!status}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default ProcessOrder;
