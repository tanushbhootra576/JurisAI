import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import "./Login.css";  // Import the CSS file for styling
import { avatarUrls, getAvatarUrlByName } from '../icons/avatars';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/api/google", { token: credentialResponse.credential });

      if (res.data.message === "Successful") {
        // Store user data in localStorage (map avatar name/index to local URL)
        const serverUser = res.data.user || {};
        let avatarUrl = null;
        if (serverUser.avatar && typeof serverUser.avatar === 'string') {
          avatarUrl = serverUser.avatar.includes('/') ? serverUser.avatar : getAvatarUrlByName(serverUser.avatar) || null;
        }
        if (!avatarUrl && typeof serverUser.avatarIndex === 'number') avatarUrl = avatarUrls[serverUser.avatarIndex] || null;

        const user = { ...serverUser, avatar: avatarUrl, avatarName: serverUser.avatar };
        localStorage.setItem("user", JSON.stringify(user));
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        navigate("/JurisBot");
      } else {
        alert(`Login failed: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Google Login error:", error);
      alert("An error occurred during Google login.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="PAR">Login with Google</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              alert("Google login failed");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
