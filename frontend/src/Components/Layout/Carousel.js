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
      style={{ height: "600px", width: "100%", overflow: "hidden" }}
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
                  height: "600px",
                }}
              />
              <Carousel.Caption>
                <h1
                  style={{
                    textShadow:
                      "-1px -1px 1px black, 1px -1px 1px black, -1px 1px 1px black, 1px 1px 1px black",
                  }}
                >
                  {event.name}
                </h1>
              </Carousel.Caption>
            </>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselFP;
