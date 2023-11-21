import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const CarouselFP = ({ events }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    if (events.length > 0) {
      setCurrentEventIndex(0);
    }
  }, [events]);

  return (
    <Carousel
      activeIndex={currentEventIndex}
      onSelect={(selectedIndex) => setCurrentEventIndex(selectedIndex)}
      pause="hover"
      style={{ height: "600px", overflow: "hidden" }}
    >
      {events.map((event, index) => (
        <Carousel.Item key={index}>
          {event.images && event.images.length > 0 && (
            <>
              <img
                className="d-block w-100"
                src={event.images[0].url}
                alt={event.name}
                style={{
                  objectFit: "cover",
                  height: "100%",
                  maxHeight: "600px",
                }}
              />
              <Carousel.Caption>
                <div style={{ padding: "15rem" }}>
                  <h1>{event.name}</h1>
                  <Link
                    to={`/event/${event._id}`}
                    id="view_btn"
                    className="btn btn-block"
                    style={{ maxWidth: "200px", margin: "0 auto" }}
                  >
                    <b>BUY TICKETS</b>
                  </Link>
                </div>
              </Carousel.Caption>
            </>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselFP;
