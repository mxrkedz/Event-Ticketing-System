import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./Layout/MetaData";
import axios from "axios";
import Pagination from "react-js-pagination";
import Loader from "./Layout/Loader";
import ListPost from "./Post/ListPosts";

// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
import { useParams } from "react-router-dom";
import Carousel from "./Layout/Carousel";
import CloseIcon from "@mui/icons-material/Close";

const categories = ["Convention", "Expo", "Music"];

const News = ({ post }) => {
  let { keyword } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const [postsCount, setPostsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resPerPage, setResPerPage] = useState(0);
  const [filteredPostsCount, setFilteredPostsCount] = useState(0);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const getPosts = async (page = 1, keyword = "") => {
    let link = "";

    link = `${process.env.REACT_APP_API}/api/v1/posts/?page=${page}&keyword=${keyword}`;

    console.log(link);
    let res = await axios.get(link);
    console.log(res);
    setPosts(res.data.posts);
    setResPerPage(res.data.resPerPage);
    setPostsCount(res.data.postsCount);
    setLoading(false);
  };
  useEffect(() => {
    getPosts(currentPage, keyword);
  }, [currentPage, keyword]);

  let count = postsCount;
  if (keyword) {
    count = filteredPostsCount;
  }
  return (
    <Fragment>
      <MetaData title={"News"} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="container" style={{ marginBottom: "8%" }}>
            <h1 className="my-4 text-left">Latest News</h1>
            <hr />
            <section id="posts" className="mt-5">
              <div className="row">
                {posts &&
                  posts.map((post) => <ListPost key={post._id} post={post} />)}
              </div>
            </section>
            {resPerPage <= postsCount && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={postsCount}
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
    </Fragment>
  );
};

export default News;
