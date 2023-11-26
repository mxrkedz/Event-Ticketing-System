import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import Post from "./PostDetails";
import Loader from "../Layout/Loader";
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
import { useParams } from "react-router-dom";

const ListPosts = ({ post }) => {
  return (
    <div className="col-lg-12 col-sm-8 col-sm-4 my-3">
      <div
        className="card p-3 rounded"
        style={{
          width: "100%",
          WebkitBoxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {post.images && post.images.length > 0 && (
          <img
            className="card-img-top"
            src={post.images[0].url}
            alt={post.name}
            style={{
              width: "auto",
              height: "500px",
              border: "5px ridge #904E55",
              borderRadius: "5px",
            }}
          />
        )}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{ margin: "0.1rem 0" }}>
            <b>{post.title}</b>
          </h5>
          <p id="post_id" style={{ margin: "0.1rem 0" }}>
            {post.location}
          </p>
        </div>
        <Link to={`/news/${post._id}`} id="view_btn" className="btn btn-block">
          <b>Check Details</b>
        </Link>
      </div>
    </div>
  );
};

export default ListPosts;
