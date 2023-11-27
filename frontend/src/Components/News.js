import React, { Fragment, useState, useEffect, useRef } from "react";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import Pagination from "react-js-pagination";
import ListPost from "./Post/ListPosts";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import Loader from "./Layout/Loader";

const News = () => {
  let { keyword } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);

  const getPosts = async () => {
    try {
      const link = `${process.env.REACT_APP_API}/api/v1/posts?page=${currentPage}&per_page=1`;

      const res = await axios.get(link);
      console.log(res);
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      setResPerPage(res.data.resPerPage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
      setLoading(false);
    }
  };

  const fetchMoreData = () => {
    setLoading(true);
    setCurrentPage((prevPageNumber) => prevPageNumber + 1);
  };

  const pageEnd = useRef();

  useEffect(() => {
    getPosts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreData();
        }
      },
      { threshold: 1 }
    );

    observer.observe(pageEnd.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loading) {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          fetchMoreData();
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading]);

  return (
    <Fragment>
      <Fragment>
        <MetaData title={"News"} />
        <div className="container">
        <h1 className="my-4 text-left" id="titlePage">Latest News</h1>
            <hr style={{ marginBottom: "5%" }}/>
        {posts.map((post) => (
          <div className="mb-5">
            <ListPost key={post._id} post={post} col={1} />
          </div>
        ))}
        <div className="loading" ref={pageEnd}>
        {loading ? <Loader /> : posts.length === 0 ? null : <h4 className="d-flex justify-content-center mt-5" id="titlePage">- No More News -</h4>}
        </div></div>
      </Fragment>
    </Fragment>
  );
};

export default News;
