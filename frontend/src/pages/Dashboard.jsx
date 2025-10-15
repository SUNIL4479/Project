import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from 'axios';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        localStorage.removeItem("auth_token");
        setProfile(null);
      });
    }
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1">
        <div className="bg-black w-full p-4 flex justify-center items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white md:hidden mr-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <h2 className="inline-block font-semibold text-3xl text-white mr-3">Welcome</h2>
            <h1 className="inline-block font-bold text-2xl text-white mr-8">{profile ? profile.username.split(" ")[0] : ""}</h1>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
