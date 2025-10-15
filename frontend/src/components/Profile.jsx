import { useState, useEffect } from "react";
import axios from "axios"
export default function Profile() {
  const [profile, setProfile] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        axios.get(`${backend}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          setProfile(res.data);
        }).catch(err => {
          console.error("Failed to fetch profile", err);
        });
      }
    }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="bg-purple p-4 rounded shadow">
        <h2>Avatar</h2>
        <div className="mb-6">
          <img
            src={profile ? profile.ProfilePic : "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300"
          />
        </div>
        <h2 >Username</h2>
        <div className="lg:w-1/2 h-12 py-2 px-3 text-white bg-black mb-3 rounded-3xl border border-4 border-gray">{profile ? profile.username : ""}</div>
        <h2 >Email</h2>
        <div className="lg:w-1/2 h-12 py-2 px-3 text-white bg-black mb-3 rounded-3xl border border-4 border-gray">{profile ? profile.email : ""}</div>
        <h2 >College</h2>
        <div className="lg:w-1/2 h-12 py-2 px-3 text-white bg-black mb-6 rounded-3xl border border-4 border-gray">JohnDoe College</div>   
        <div className="lg:w-1/2 text-center"><button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit Profile</button></div>
      </div>
    </div>
  );
}