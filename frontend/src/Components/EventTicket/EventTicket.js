import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const EventTicket = ({ event }) => {
  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        {event.images && event.images.length > 0 && (
          <img className="card-img-top mx-auto" src={event.images[0].url} alt={event.name} />
        )}
        <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          {event.name}
        </h5>
          {/* {`/product/${event._id}`} */}
          <Link to={`/event/${event._id}`} id="view_btn" className="btn btn-block">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;
