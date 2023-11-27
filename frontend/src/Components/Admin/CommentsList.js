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

const CommentsList = () => {
  const [allComments, setallComments] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  let navigate = useNavigate();
  const getAdminComments = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/comments`,
        config
      );
      console.log(data);
      setallComments(data.comments);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    getAdminComments();

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
      toast.success("Comment Deleted Successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/admin/inquiries");

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
        `${process.env.REACT_APP_API}/api/v1/admin/comment/${id}`,
        config
      );

      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  const commentsList = () => {
    const data = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Subject",
          field: "subject",
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

    allComments.forEach((comment) => {
      data.rows.push({
        id: comment._id,
        name: comment.name,
        email: comment.email,
        subject: comment.subject,
        content: comment.content,
        actions: (
          <Fragment>
            <Link
              to={`/admin/inquiries/${comment._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteCommentHandler(comment._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteCommentHandler = (id) => {
    deletePost(id);
  };

  return (
    <Fragment>
      <MetaData title={"All feedbacks"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5" id="titlePage">All Feedbacks</h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={commentsList()}
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

export default CommentsList;
