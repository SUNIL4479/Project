import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const backend = process.env.BASE_URI || "http://localhost:5000";
      axios
        .get(`${backend}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
          localStorage.removeItem("auth_token");
          setProfile(null);
        });
    }
  }, []);

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      {/* Sidebar (fixed on left) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] bg-black p-4 flex justify-center items-center z-40">
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
            <h2 className="inline-block font-semibold text-3xl text-white mr-3">
              Welcome
            </h2>
            <h1 className="inline-block font-bold text-2xl text-white mr-8">
              {profile ? profile.username.split(" ")[0] : ""}
            </h1>
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto mt-[72px] p-6 md:ml-64 text" style={{ background: 'linear-gradient(45deg, white 50%, black 50%)' }}>
          {/* The create contest or other dashboard pages will render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
