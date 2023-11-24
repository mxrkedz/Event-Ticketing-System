import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Metadata from '../Layout/MetaData';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(
    '/assets/img/default_avatar.jpg',
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const notify = (message, type = 'error') =>
    toast[type](message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  let navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      console.log(error);
      notify(error.message || 'An error occurred');
      setError();
    }
  }, [error, isAuthenticated]);

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validation checks
    if (!name || !email || !password || password.length < 6) {
      notify(
        'Please fill in all fields and ensure the password is at least 6 characters long',
      );
      return;
    }

    // Check if the email is already taken
    try {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/check-email?email=${email}`,
      );

      if (data.exists) {
        notify('Email is already taken', 'error');
        return;
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('avatar', avatar);

    register(formData);
  };

  const onChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const register = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post(
        'http://localhost:4001/api/v1/register',
        userData,
        config,
      );

      setIsAuthenticated(true);
      setLoading(false);
      setUser(data.user);
      navigate('/');

      // Display success notification
      notify('Registration successful', 'success');
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
      <Metadata title={'Register'} />
      <div className="row wrapper" style={{marginBottom:"7%"}}>
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
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
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
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
          </form>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default Register;
