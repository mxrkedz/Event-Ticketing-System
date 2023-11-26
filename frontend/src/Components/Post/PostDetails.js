import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const PostDetails = ({ post }) => {
  return (
    <div className="col-sm-12 col-md-8 col-lg-4 my-3">
      <div className="card p-3 rounded">
        {post.images && post.images.length > 0 && (
          <img
            className="card-img-top"
            src={post.images[0].url}
            alt={post.name}
            style={{ width: "auto", height: "200px" }}
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
        <Link
            to={`/post/${post._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            <b>Check Details</b>
          </Link>
      </div>
    </div>
  );
};

export default PostDetails;