import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/MetaData";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [Post, setPost] = useState({});

  let navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("title", title);
    formData.set("location", location);
    formData.set("content", content);

    images.forEach((image) => {
      formData.append("images", image);
    });

    newPost(formData);
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
  const newPost = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4001/api/v1/admin/post/new`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setPost(data.post);
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
      navigate("/admin/posts");
      toast.success("Post created successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  return (
    <Fragment>
      <MetaData title={"New Post"} />
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
                <h1 className="mb-4">New Post</h1>

                <div className="form-group">
                  <label htmlFor="title_field">Title</label>
                  <input
                    type="text"
                    id="title_field"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location_field">Location</label>
                  <input
                    type="text"
                    id="location_field"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content_field">Content</label>
                  <input
                    type="text"
                    id="content_field"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
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

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  // disabled={loading ? true : false}
                >
                  CREATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default NewPost;
