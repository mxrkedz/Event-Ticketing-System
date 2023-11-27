import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import Pagination from "react-js-pagination";
import Event from "./EventTicket/EventTicket";
import Loader from "./Layout/Loader";
import { useParams, useNavigate } from "react-router-dom";
import Carousel from "./Layout/Carousel";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const categories = ["Convention", "Expo", "Music"];

const Home = () => {
  let { keyword } = useParams();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState();
  const [eventsCount, setEventsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);
  const [filteredEventsCount, setFilteredEventsCount] = useState(0);
  const [category, setCategory] = useState("");

  let navigate = useNavigate();
  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const getEvents = async (page = 1, keyword = "") => {
    let link = "";

    link = `${process.env.REACT_APP_API}/api/v1/events/?page=${page}&keyword=${keyword}`;

    if (category) {
      navigate("/");
      link = `${process.env.REACT_APP_API}/api/v1/events?keyword=${keyword}&page=${currentPage}&category=${category}`;
    }

    console.log(link);
    let res = await axios.get(link);
    console.log(res);
    setEvents(res.data.events);
    setResPerPage(res.data.resPerPage);
    setEventsCount(res.data.eventsCount);
    setLoading(false);
  };
  useEffect(() => {
    getEvents(currentPage, keyword, category);
  }, [currentPage, keyword, category]);

  const clearCategory = () => {
    setCategory("");
  };

  let count = eventsCount;
  if (keyword) {
    count = filteredEventsCount;
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Home"} />
          <div style={{ height: "500px", width: "100%", marginBottom: "8%" }}>
            <Carousel events={events} />
          </div>
          <div className="container" style={{ marginBottom: "5%" }}>
            <h1 className="my-4 text-left" id="titlePage">
              Latest Events
            </h1>
            <hr />
            <div>
              <ul
                className="pl-0"
                style={{ display: "flex", listStyle: "none", padding: 0 }}
              >
                <Stack direction="row" spacing={1}></Stack>
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    className={`category_btn ${
                      category === cat ? "active" : ""
                    }`}
                    onClick={() => setCategory(cat)}
                    style={{
                      marginRight: "10px",
                    }}
                  />
                ))}
                {category && (
                  <Chip
                    className="clear_btn"
                    color="error"
                    onDelete={clearCategory}
                    label="Clear"
                  />
                )}
              </ul>
            </div>
            <hr />

            <section id="events" className="mt-5">
              <div className="row">
                {events &&
                  events.map((event) => (
                    <Event key={event._id} event={event} />
                  ))}
              </div>
            </section>
            {resPerPage <= eventsCount && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={eventsCount}
                  onChange={setCurrentPageNo}
                  nextPageText={"Next"}
                  prevPageText={"Prev"}
                  firstPageText={"First"}
                  lastPageText={"Last"}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            )}
          </div>
        </Fragment>
      )}
    </>
  );
};

export default Home;
