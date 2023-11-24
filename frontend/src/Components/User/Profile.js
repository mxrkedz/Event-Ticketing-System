import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../../utils/helpers";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LockIcon from "@mui/icons-material/Lock";
import Tooltip from "@mui/material/Tooltip";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const getProfile = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/v1/me",
        config
      );
      console.log(data);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setLoading(true);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Your Profile"} />

          <h2 className="row justify-content-center mt-5">My Profile</h2>
          <div className="container">
  <div className="row justify-content-center mt-5">
    <div className="col-12 col-md-6 mx-auto">
              <div className="profileCard">
                <div className="profileCard_img">
                  <img
                    className="img-fluid"
                    src={user.avatar.url}
                    alt={user.name}
                  />
                </div>
                <div className="card__name">
                  <h2>{user.name}</h2>
                </div>

                <div className="card__email">
                  <span>{user.email}</span>
                  <h2 style={{ marginTop: "10px", marginBottom: "-5px" }}>
                    Joined On
                  </h2>
                  <span>{String(user.createdAt).substring(0, 10)}</span>
                </div>
                <div className="card__btn">
                  <Link
                    to="/me/update"
                    id="edit_profile"
                    className="btn card__btn-contact"
                  >
                    Edit Profile
                  </Link>
                </div>

                <div class="card__link">
                  {user.role !== "admin" && (
                    <Link to="/orders/me" className="btn card__link2">
                      <i>
                        <Tooltip title="My Orders">
                          <ReceiptLongIcon />
                        </Tooltip>
                      </i>
                    </Link>
                  )}
                  <Link to="/password/update" className="btn card__link2">
                    <i>
                      <Tooltip title="Change Password">
                        <LockIcon />
                      </Tooltip>
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
