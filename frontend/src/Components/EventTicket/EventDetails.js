import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel, Dropdown, Button, Card } from "react-bootstrap";
import MetaData from "../Layout/MetaData";
import { getUser } from "../../utils/helpers";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";

const EventDetails = ({ addItemToCart, cartItems }) => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [user, setUser] = useState(getUser());
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  const eventDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/event/${id}`);
      if (!res.data) {
        setError("Event not found");
      }
      setEvent(res.data.event);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError("Error fetching event details");
    }
  };

  const addToCart = async () => {
    await addItemToCart(id, quantity);
  };

  useEffect(() => {
    eventDetails(id);
  }, [id, error, success]);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <Fragment>
      <MetaData title={event.name} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <Carousel
            pause="hover"
            style={{ height: "600px", overflow: "hidden" }}
          >
            {event.images &&
              event.images.map((image) => (
                <Carousel.Item key={image.public_id}>
                  <img
                    className="d-block w-100"
                    src={image.url}
                    alt={event.title}
                    style={{ objectFit: "cover", height: "100%" }}
                  />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h1 style={{ margin: "0.1rem 0" }}>{event.name}</h1>
          <p id="category" style={{ margin: "0.1rem 0" }}>
            {event.category} by {event.organizer}
          </p>
          <p id="product_id">Event # {event._id}</p>
          <hr />

          <div className="mt-2">
            <h4>
              <b>About:</b>
            </h4>
            <h5>{event.description}</h5>
          </div>
          <hr/>
          <h6 className="mt-2">
            <b>Date:</b> {formatDate(event.startDate)} to{" "}
            {formatDate(event.endDate)}
          </h6>
          <h6 className="mt-2">
            <b>Location:</b> {event.location}
          </h6>
          <h6 className="mt-2">
            <b>Category:</b> {event.category}
          </h6>
          <hr/>
          <h4 className="mt-2">
            <b>Price: ₱</b>
            {event.price}
            <div className="mt-auto float-right">
            <Button className="btn addToCart_btn" onClick={addToCart}>
              <AddShoppingCartSharpIcon /> Add to Cart
            </Button>
          </div>
          </h4>
          <br/>
          
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default EventDetails;
