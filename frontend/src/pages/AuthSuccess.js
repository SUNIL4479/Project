import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setError("No token provided");
          return;
        }

        // ✅ Store token
        localStorage.setItem("auth_token", token);

        // ✅ Fetch profile
        const backend = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${backend}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile fetched:", res.data);

        // ✅ Redirect only after successful profile fetch
        navigate("/Home");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please try logging in again.");
      }
    };

    fetchProfile();
  }, [searchParams, navigate]);

  // ✅ UI states
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2>{error}</h2>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2>Authenticating... Please wait</h2>
    </div>
  );
}
