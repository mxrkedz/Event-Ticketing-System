import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../Layout/Loader';
import Metadata from '../Layout/MetaData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { authenticate, getUser } from '../../utils/helpers';
import OAuth from './OAuth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

  const notify = (error) =>
    toast.error(error, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(`http://localhost:4001/api/v1/login`, { email, password }, config);

      authenticate(data, () => {
        notify('Login successful');
        navigate(`/${redirect}`);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } catch (error) {
      toast.error('Invalid email or password', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    if (getUser() && redirect === 'shipping') {
      navigate(`/${redirect}`);
    }
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={'Login'} />

          <div className="row wrapper" style={{ marginBottom: '16%' }}>
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={formik.handleSubmit}>
                <h1 className="mb-3">Login</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error" style={{ color: 'red' }}>{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error" style={{ color: 'red' }}>{formik.errors.password}</div>
                  ) : null}
                </div>

                <Link to="/password/forgot" className="float-right mb-4">
                  Forgot Password?
                </Link>

                <button id="login_button" type="submit" className="btn btn-block py-3">
                  LOGIN
                </button>
                <OAuth />

                <Link to="/register" className="float-right mt-3">
                  New User?
                </Link>
              </form>
            </div>
          </div>
          <ToastContainer />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
