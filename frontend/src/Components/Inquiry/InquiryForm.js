import React, { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { getUser } from "../../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailIcon from "@mui/icons-material/Email";
import emailjs from "@emailjs/browser";

const InquiryForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getUser() ? getUser() : {});
  const [isChecked, setIsChecked] = useState(false);
  const [Comment, setComment] = useState({});

  const subjects = ["Inquiry", "Request", "Complaint"];

  let navigate = useNavigate();

  const form = useRef();

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Email address is invalid";
    }

    if (!subject) {
      errors.subject = "Please select a subject";
    }

    if (!content.trim()) {
      errors.content = "Message is required";
    }

    if (images.length === 0) {
      errors.images = "Please upload at least one image";
    }

    if (!isChecked) {
      errors.isChecked = "Please agree to the data privacy policy";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
    // return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("content", content);
    images.forEach((image) => {
      formData.append("images", image);
    });

    // const validationErrors = validateForm();
    // if (Object.keys(validationErrors).length !== 0) {
    //   setError("Please fill in the required fields");
    //   return;
    // }

    newComment(formData);
  } else {
    toast.error('Please fill in all required fields.', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
    emailjs
      .sendForm(
        "service_rmf4fjc",
        "template_0jh272o",
        form.current,
        "ZhHO9W2UQjGXKpmjY"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
      // console.log(reader)
    });
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
              ref={form}
              className=""
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  name="from_name"
                  id="name_field"
                  className={`form-control ${error && error.name && "is-invalid"}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {error.name && (
            <div className="invalid-feedback">{error.name}</div>
          )}
              </div>

              <div className="form-group">
                <label htmlFor="email_field">Email Address</label>
                <input
                  type="text"
                  name="from_email"
                  id="email_field"
                  className={`form-control ${error && error.email && "is-invalid"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && error.email && (
                  <div className="invalid-feedback">{error.email}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="subject_field">Subject</label>
                <select
                  name="email_subject"
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
                  name="message"
                  type="text"
                  id="content_field"
                  className={`form-control ${error && error.content && "is-invalid"}`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />{error && error.content && (
                  <div className="invalid-feedback">{error.content}</div>
                )}
              </div>

              <div className="form-group">
                  <label>Images</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChange}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>

                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
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
                {error && error.isChecked && (
                  <div className="invalid-feedback">{error.isChecked}</div>
                )}
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
