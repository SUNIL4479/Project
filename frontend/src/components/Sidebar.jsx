import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <div
      className={`w-64 bg-black text-white h-screen p-5 flex flex-col fixed top-0 left-0 z-50 transform transition-transform duration-300 
      md:translate-x-0 overflow-y-auto 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Close button for mobile */}
      <button
        onClick={() => setIsOpen(false)}
        className="md:hidden self-end mb-4 text-white"
      >
        ✕
      </button>

      {/* Dashboard Title */}
      <h1 className="text-2xl font-bold mb-10 text-center mt-4 sticky top-0 bg-black z-10 pb-2">
        User Dashboard
      </h1>

      <hr className="mb-3 border-gray-700" />

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 font-semibold">
        <Link
          to="/dashboard/profile"
          className={`${
            location.pathname === "/dashboard/profile"
              ? "bg-white text-black"
              : ""
          } hover:bg-green-600 hover:text-black p-2 rounded flex items-center`}
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          Profile
        </Link>

        <Link
          to="/dashboard/participated"
          className={`${
            location.pathname === "/dashboard/participated"
              ? "bg-white text-black"
              : ""
          } hover:bg-green-600 hover:text-black p-2 rounded flex items-center`}
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Contests Participated
        </Link>

        <Link
          to="/dashboard/created"
          className={`${
            location.pathname === "/dashboard/created"
              ? "bg-white text-black"
              : ""
          } hover:bg-green-600 hover:text-black p-2 rounded flex items-center`}
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          Contests Created
        </Link>

        <Link
          to="/dashboard/performance"
          className={`${
            location.pathname === "/dashboard/performance"
              ? "bg-white text-black"
              : ""
          } hover:bg-green-600 hover:text-black p-2 rounded flex items-center`}
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          My Performance
        </Link>

        <Link
          to="/"
          className="hover:bg-red-600 p-2 rounded mt-auto flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </Link>
      </nav>
    </div>
  );
}
