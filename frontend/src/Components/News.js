import React, { Fragment, useState, useEffect } from "react";
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
  const [postsCount, setPostsCount] = useState(0);
  const [filteredPostsCount, setFilteredPostsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);

  const getPosts = async (currentPage = 1, keyword = "") => {
    try {
      const link = `${process.env.REACT_APP_API}/api/v1/posts/?page=${currentPage}&keyword=${keyword}`;
      console.log("Fetching posts. Page:", currentPage);

      const res = await axios.get(link);
      console.log(res);
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      setResPerPage(res.data.resPerPage);
      setPostsCount(res.data.postsCount);
      setFilteredPostsCount(res.data.filteredPostsCount);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
      setLoading(false);
    }
  };

  let count = postsCount;

  if (keyword) {
    count = filteredPostsCount;
  }
  const fetchMoreData = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    getPosts(currentPage, keyword);
  }, [currentPage, keyword]);

  return (
    <Fragment>
      <MetaData title={"News"} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div
            className="container-fluid"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {resPerPage <= postsCount && (
              <div
                id="parentScroll"
                className="d-flex justify-content-center mt-5"
              >
                <InfiniteScroll
                  dataLength={posts.length}
                  next={fetchMoreData}
                  scrollableTarget="#parentScroll"
                  hasMore={currentPage * resPerPage < postsCount}
                  loader={<Loader />}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>No more posts</b>
                    </p>
                  }
                >
                  <div
                    className="container-fluid"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {posts.map((post) => (
                      <ListPost key={post._id} post={post} />
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default News;
