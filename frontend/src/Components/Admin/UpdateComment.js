import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/MetaData";
import Sidebar from "./SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";

const subjects = ["Inquiry", "Request", "Complaint"];

const UpdateComment = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [comment, setComment] = useState({});
  const [updateError, setUpdateError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  let { id } = useParams();
  let navigate = useNavigate();

  const errMsg = (message = "") =>
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  const successMsg = (message = "") =>
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  const getCommentDetails = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/comment/${id}`,
        config
      );
      setComment(data.comment);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const updatePost = async (id, commentData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/comment/${id}`,
        commentData,
        config
      );
      setIsUpdated(data.success);
    } catch (error) {
      setUpdateError(error.response.data.message);
    }
  };
  useEffect(() => {
    if (comment && comment._id !== id) {
      getCommentDetails(id);
    } else {
      setName(comment.name);
      setEmail(comment.email);
      setContent(comment.content);
    }
    if (error) {
      errMsg(error);
    }
    if (updateError) {
      errMsg(updateError);
    }
    if (isUpdated) {
      navigate("/admin/inquiries");
      successMsg("Post Updated Successfully");
    }
  }, [error, isUpdated, updateError, comment, id]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("content", content);

    updatePost(comment._id, formData);
  };

  return (
    <Fragment>
      <MetaData title={"Update Post"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <h1 className="mb-4" style={{marginRight:"150px"}}>Update Post</h1>
                <hr/>
                <div className="form-group">
                  <label htmlFor="title_field">Name</label>
                  <input
                    type="text"
                    id="title_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location_field">Email Address</label>
                  <input
                    type="text"
                    id="location_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                <label htmlFor="subject_field">Subject</label>
                <select
                  className="form-control"
                  id="subject_field"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

                <div className="form-group">
                  <label htmlFor="content_field">Message</label>
                  <input
                    type="text"
                    id="content_field"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={loading ? true : false}
                >
                  UPDATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateComment;