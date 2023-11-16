import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel, Dropdown, Button, Card } from "react-bootstrap";
import MetaData from "../Layout/MetaData";
import { getUser, successMsg, errMsg } from "../../utils/helpers";
import axios from "axios";
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';

const EventDetails = ({ addItemToCart, cartItems }) => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [user, setUser] = useState(getUser());
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [success, setSuccess] = useState("");

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

  const handleTicketSelect = (ticketType) => {
    const selectedTicket = event.tickets.find(
      (ticket) => ticket.type === ticketType
    );
    setSelectedTicket(selectedTicket);
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
                    style={{ objectFit: "fill", height: "100%" }}
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

          <h4 className="mt-2">
            <b>About:</b>
          </h4>
          <h5>{event.description}</h5>
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
          <hr />
          <h4 className="mt-2">
            <b>Tickets:</b>
          </h4>
          <div style={{ width: "160px" }}>
            {" "}
            <Dropdown onSelect={handleTicketSelect}>
              <Dropdown.Toggle
                id="dropdown-basic"
                variant="light"
                className="custom-dropdown"
              >
                {selectedTicket ? selectedTicket.type : "Select a Ticket"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {event.tickets &&
                  event.tickets.map((ticket) => (
                    <Dropdown.Item key={ticket.type} eventKey={ticket.type}>
                      {ticket.type}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {selectedTicket && (
            <div className="d-flex justify-content-center mt-3">
              <Card style={{ width: "100rem" }}>
                <Card.Body
                  className="d-flex flex-column"
                  style={{ paddingLeft: "20px" }}
                >
                  <Card.Title>
                    <h4 className="mt-2">
                      <b>{selectedTicket.type}</b>
                    </h4>
                  </Card.Title>
                  <Card.Text>
                    <h5 className="mt-2">{selectedTicket.description}</h5>
                  </Card.Text>
                  <Card.Text>
                    <h4 className="mt-2">
                      <b>Price:</b> ₱{selectedTicket.price}
                    </h4>
                  </Card.Text>
                  <div className="mt-auto">
                    <Button variant="success" onClick={addToCart}>
                    <AddShoppingCartSharpIcon /> Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default EventDetails;
