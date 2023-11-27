import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../Layout/MetaData";
import Loader from "../Layout/Loader";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostsList = () => {
  const [allPosts, setallPosts] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  let navigate = useNavigate();
  const getAdminPosts = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/posts`,
        config
      );
      console.log(data);
      setallPosts(data.posts);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    getAdminPosts();

    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (deleteError) {
      toast.error(deleteError, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (isDeleted) {
      toast.success("Post Deleted Successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/admin/posts");

      setIsDeleted(false);
      setDeleteError("");
    }
  }, [error, deleteError, isDeleted]);

  const deletePost = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/admin/post/${id}`,
        config
      );

      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  const postsList = () => {
    const data = {
      columns: [
        {
          label: "Title",
          field: "title",
          sort: "asc",
        },
        {
          label: "Location",
          field: "location",
          sort: "asc",
        },
        {
          label: "Content",
          field: "content",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    allPosts.forEach((post) => {
      data.rows.push({
        id: post._id,
        title: post.title,
        location: post.location,
        content: post.content,
        actions: (
          <Fragment>
            <Link
              to={`/admin/post/${post._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deletePostHandler(post._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deletePostHandler = (id) => {
    deletePost(id);
  };

  return (
    <Fragment>
      <MetaData title={"All posts"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-4" id="titlePage">
              All posts
            </h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={postsList()}
                className="px-3"
                bordered
                striped
                hover
              />
            )}
          </Fragment>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default PostsList;
