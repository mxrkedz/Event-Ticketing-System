// OAuth.js
import React, { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { authenticateGoogle } from "../../utils/helpers";
import GoogleIcon from '@mui/icons-material/Google';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function OAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search
    ? new URLSearchParams(location.search).get("redirect")
    : "";

  const signInWithGoogle = async (email, password) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/google`,
        {
          email: user.email,
          name: user.displayName || user.email,
          avatar: user.photoURL,
        },
        config
      );
      
      setUser(user);
      authenticateGoogle(data, () => {
        if (data.newUser) {
          navigate(`/login`);
        } else {
          navigate(`/${redirect}`);
        }
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      type="button"
      className="btn btn-block py-3 mt-3"
      id="login-with-google-btn"
    >
      <GoogleIcon style={{marginBottom:"1px"}}/> CONTINUE WITH GOOGLE
    </button>
  );
}

export default OAuth;
