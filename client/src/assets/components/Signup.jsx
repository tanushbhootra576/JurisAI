import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import "./Signup.css"; 
import { avatarUrls, getAvatarUrlByName } from '../icons/avatars';

const Signup = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/api/google", { token: credentialResponse.credential });

      if (res.data.message === "Successful") {
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
        alert(`Signup failed: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Google Login error:", error);
      alert("An error occurred during Google signup.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="PAR">Sign Up with Google</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              alert("Google signup failed");
            }}
          />
        </div>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary-color)" }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
