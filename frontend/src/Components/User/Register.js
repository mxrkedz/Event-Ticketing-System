import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Metadata from "../Layout/MetaData";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "./OAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/assets/img/default_avatar.jpg"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const notify = (message, type = "error") =>
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  let navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      console.log(error);
      notify(error.message || "An error occurred");
      setError();
    }
  }, [error, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validation checks
    if (!name || !email || !password || password.length < 6) {
      notify(
        "Please fill in all fields and ensure the password is at least 6 characters long"
      );
      return;
    }

    // Check if the email is already taken
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/check-email?email=${email}`
      );

      if (data.exists) {
        notify("Email is already taken", "error");
        return;
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    register(formData);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email);
      formData.set("password", values.password);
      formData.set("avatar", values.avatar);

      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const { data } = await axios.post(
          "http://localhost:4001/api/v1/register",
          formData,
          config
        );

        setLoading(false);
        navigate("/");
        notify("Registration successful", "success");
      } catch (error) {
        setLoading(false);
        notify(
          error.response?.data?.message || "An error occurred",
          "error"
        );
      }
    },
  });

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          formik.setFieldValue("avatar", reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      formik.handleChange(e);
    }
  };

  const register = async (userData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "http://localhost:4001/api/v1/register",
        userData,
        config
      );

      setIsAuthenticated(true);
      setLoading(false);
      setUser(data.user);
      navigate("/");

      // Display success notification
      notify("Registration successful", "success");
    } catch (error) {
      setIsAuthenticated(false);
      setLoading(false);
      setUser(null);
      setError(error);
      console.log(error);
    }
  };

  return (
    <Fragment>
      <Metadata title={"Register"} />
      <div className="row wrapper" style={{ marginBottom: "7%" }}>
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={formik.handleSubmit}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name ? (
                <div style={{ color: "red" }}>{formik.errors.name}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="avatar"
                    accept="images/*"
                    onChange={onChange}
                  />
                  <label className="custom-file-label" htmlFor="avatar">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              // disabled={loading ? false : true}
            >
              REGISTER
            </button>
            <OAuth />
          </form>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default Register;
