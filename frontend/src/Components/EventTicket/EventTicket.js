import React, { Fragment } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link } from "react-router-dom";
import { Chip } from "@mui/material";

const EventTicket = ({ event }) => {
  return (
    <div className="col-sm-12 col-md-8 col-lg-4 my-3">
      <div
        className="card p-3 rounded"
        style={{
          width: "100%",
          WebkitBoxShadow: "0px 22px 22px 0px rgba(0,0,0,0.55)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {event.images && event.images.length > 0 && (
          <img
            className="card-img-top"
            src={event.images[0].url}
            alt={event.name}
            style={{
              width: "auto",
              height: "300px",
              border: "5px ridge #904E55",
              borderRadius: "5px",
            }}
          />
        )}
        <div className="card-body d-flex flex-column">
        
          <h5 className="card-title" style={{ margin: "0.1rem 0" }}>
            <b>{event.name}</b>
          </h5>
          <p id="product_id" style={{ margin: "-0.3rem 0" }}>
            {event.category}
          </p>
          <p id="product_id" style={{ margin: "-0.1rem 0" }}>
            {event.location}
          </p>
          <p id="eventDate" style={{ margin: "0.1rem" }}>
            <CalendarMonthIcon />{" "}
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
