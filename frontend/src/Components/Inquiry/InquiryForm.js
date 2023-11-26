import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { getUser } from "../../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailIcon from "@mui/icons-material/Email";

const InquiryForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getUser() ? getUser() : {});
  const [isChecked, setIsChecked] = useState(false);
  const [Comment, setComment] = useState({});

  const subjects = ["Inquiry", "Request", "Complaint"];

  let navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("content", content);

    newComment(formData);
  };

  const newComment = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/comment/new`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setComment(data.comment);

      setName("");
      setEmail("");
      setSubject("");
      setContent("");
      setIsChecked(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (success) {
      toast.success("Submitted Successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  return (
    <Fragment>
      <MetaData title={"Inquiry & Feedback"} />
      <div className="container">
        <Fragment>
          <div className="wrapper my-3">
            <form
              className=""
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email_field">Email Address</label>
                <input
                  type="text"
                  id="email_field"
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
                <textarea
                  type="text"
                  id="content_field"
                  className="form-control"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />{" "}
                  By using this contact form you agree with the storage and
                  handling of your data by this website in accordance with our
                  Data Privacy Policy
                </label>
              </div>

              <button
                id="login_button"
                type="submit"
                className={`btn btn-block py-3 ${isChecked ? "" : "disabled"}`}
                disabled={!isChecked}
              >
                SUBMIT
              </button>
            </form>
          </div>
        </Fragment>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default InquiryForm;
