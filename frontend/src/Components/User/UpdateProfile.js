import React, { Fragment, useState, useEffect } from 'react'
import Metadata from '../Layout/MetaData'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';


const UpdateProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const [error, setError] = useState('')
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [avatarError, setAvatarError] = useState('');
    
    let navigate = useNavigate();


    const getProfile = async () => {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/me`, config)
            console.log(data)
            // setUser(data.user)
            setName(data.user.name);
            setEmail(data.user.email);
            setAvatarPreview(data.user.avatar.url)
            setLoading(false)
        } catch (error) {
            toast.error('user not found', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }


    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/me/update`, userData, config)
            setIsUpdated(data.success)
            setLoading(false)
            toast.success('user updated', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            //  getProfile();
            navigate('/me', { replace: true })




        } catch (error) {
            console.log(error)
            toast.error('user not found', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }


    // console.log(error)
    useEffect(() => {
        getProfile()


    }, [])


    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!name) {
            setNameError('Name is required');
            return;
        } else {
            setNameError('');
        }

        if (!email) {
            setEmailError('Email is required');
            return;
        } else {
            setEmailError('');
        }

        if (!avatar) {
            setAvatarError('Avatar is required');
            return;
        } else {
            setAvatarError('');
        }

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);

        // Call the updateProfile function only if there are no validation errors
        updateProfile(formData);
    };



    const onChange = e => {
        const reader = new FileReader();


        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }


        reader.readAsDataURL(e.target.files[0])


    }
    console.log(user)
    return (
        <Fragment>
            <Metadata title={'Update Profile'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        {/* ... existing code ... */}

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className={`form-control ${nameError ? 'is-invalid' : ''}`}
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {nameError && <div className="invalid-feedback">{nameError}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {emailError && <div className="invalid-feedback">{emailError}</div>}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className={`custom-file-input ${avatarError ? 'is-invalid' : ''}`}
                                        id='customFile'
                                        accept='image/*'
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                    {avatarError && <div className="invalid-feedback">{avatarError}</div>}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false} >Update</button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};


export default UpdateProfile
