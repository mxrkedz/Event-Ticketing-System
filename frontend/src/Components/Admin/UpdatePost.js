import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/MetaData";
import Sidebar from "./SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";

const UpdatePost = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [post, setPost] = useState({});
  const [oldImages, setOldImages] = useState([]);
  const [updateError, setUpdateError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  const getPostDetails = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/post/${id}`,
        config
      );
      setPost(data.post);
      setLoading(false);
    } catch (errors) {
      setErrors(errors.response.data.message);
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:4001/api/v1/admin/post/${id}`,
        postData,
        config
      );
      setIsUpdated(data.success);
    } catch (error) {
      setUpdateError(error.response.data.message);
    }
  };
  useEffect(() => {
    if (post && post._id !== id) {
      getPostDetails(id);
    } else {
      setTitle(post.title);
      setLocation(post.location);
      setContent(post.content);
      setOldImages(post.images);
    }
    if (errors) {
      errMsg(errors);
    }
    if (updateError) {
      errMsg(updateError);
    }
    if (isUpdated) {
      navigate("/admin/posts");
      successMsg("Post Updated Successfully");
    }
  }, [errors, isUpdated, updateError, post, id]);

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    }

    if (!location.trim()) {
      errors.location = 'Location is required';
    }

    if (!content.trim()) {
      errors.content = 'Content is required';
    }

    setFormErrors(errors); // Update form errors state
    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length !== 0) {
      // If there are validation errors, set them in the state and return
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("location", location);
    formData.set("content", content);
    images.forEach((image) => {
      formData.append("images", image);
    });
    updatePost(post._id, formData);
  };
  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
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
                <h1 className="mb-4">Update Post</h1>

                <div className="form-group">
            <label htmlFor="title_field">Title</label>
            <input
              type="text"
              id="title_field"
              className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
          </div>


          <div className="form-group">
            <label htmlFor="location_field">Location</label>
            <input
              type="text"
              id="location_field"
              className={`form-control ${formErrors.location ? 'is-invalid' : ''}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {formErrors.location && <div className="invalid-feedback">{formErrors.location}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="content_field">Content</label>
            <input
              type="text"
              id="content_field"
              className={`form-control ${formErrors.content ? 'is-invalid' : ''}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {formErrors.content && <div className="invalid-feedback">{formErrors.content}</div>}
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
                  {oldImages &&
                    oldImages.map((img) => (
                      <img
                        key={img}
                        src={img.url}
                        alt={img.url}
                        className="mt-3 mr-2"
                        width="55"
                        height="52"
                      />
                    ))}
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

export default UpdatePost;
