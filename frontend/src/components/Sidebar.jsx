import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center">User Dashboard</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">
          Profile
        </Link>
        <Link to="/dashboard/participated" className="hover:bg-gray-700 p-2 rounded">
          Contests Participated
        </Link>
        <Link to="/dashboard/created" className="hover:bg-gray-700 p-2 rounded">
          Contests Created
        </Link>
        <Link to="/dashboard/performance" className="hover:bg-gray-700 p-2 rounded">
          My Performance
        </Link>
        <Link to="/" className="hover:bg-red-600 p-2 rounded mt-auto text-center">
          Logout
        </Link>
      </nav>
    </div>
  );
}