import React, { Fragment } from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from "react-router-dom";

const EventTicket = ({ event }) => {
  return (
    <div className="col-sm-12 col-md-8 col-lg-4 my-3">
      <div className="card p-3 rounded">
        {event.images && event.images.length > 0 && (
          <img
            className="card-img-top"
            src={event.images[0].url}
            alt={event.name}
            style={{ width: "auto", height: "200px" }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{ margin: "0.1rem 0" }}>
            <b>{event.name}</b>
          </h5>
          <p id="product_id" style={{ margin: "0.1rem 0" }}>
            {event.location}
          </p>
          <p id="eventDate" style={{ margin: "0.1rem" }}><CalendarMonthIcon/> {" "}
             {new Date(event.startDate)
              .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              .toUpperCase()}{" "}
            -{" "}
            {new Date(event.endDate)
              .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              .toUpperCase()}
          </p>

          
        </div>
        <Link
            to={`/event/${event._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            <b>BUY TICKETS</b>
          </Link>
      </div>
    </div>
  );
};

export default EventTicket;
