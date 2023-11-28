import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    let navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    let { token } = useParams();

    const resetPassword = async (token, passwords) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/password/reset/${token}`, passwords, config);
            setSuccess(data.success);
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
            toast.success('Password updated', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            navigate('/login');
        }
    }, [error, success]);

    const validatePassword = () => {
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateConfirmPassword = () => {
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isPasswordValid && isConfirmPasswordValid) {
            const formData = new FormData();
            formData.set('password', password);
            formData.set('confirmPassword', confirmPassword);
            resetPassword(token, formData);
        }
    };

    return (
        <Fragment>
            <MetaData title={'New Password Reset'} />
            <div className="row wrapper" style={{ marginBottom: '17%' }}>
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
                        </div>

                        <button id="new_password_button" type="submit" className="btn btn-block py-3">
                            Set Password
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default NewPassword;
