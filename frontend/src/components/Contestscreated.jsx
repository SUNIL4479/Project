import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ContestsCreated() {
  const [created, setCreated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreatedContests = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const backend = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${backend}/api/contests/created`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreated(response.data);
      } catch (error) {
        console.error('Failed to fetch created contests', error);
        setError('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedContests();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex-1 font-semibold text-gray-800">Contests Created</h2>
          <Link to="/dashboard/create-contest" className="border border-gray-600 px-4 py-1 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded shadow-md no-underline">+ Create</Link>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <p className="text-gray-600">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex-1 font-semibold text-gray-800">Contests Created</h2>
          <Link to="/dashboard/create-contest" className="border border-gray-600 px-4 py-1 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded shadow-md no-underline">+ Create</Link>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl flex-1 font-semibold text-gray-800">Contests Created</h2>
        <Link to="/dashboard/create-contest" className="border border-gray-600 px-4 py-1 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded shadow-md no-underline">+ Create</Link>
      </div>
      <ul className="bg-gray-50 p-4 rounded-lg shadow-md">
        {created.length === 0 ? (
          <li className="p-3 rounded-md mb-2 bg-white">
            <span className="text-gray-500">No contests created yet.</span>
          </li>
        ) : (
          created.map((c, index) => (
            <li key={c.id} className={`p-3 rounded-md mb-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-green-50 transition-colors duration-200`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-medium">{c.name}</span>
                  <p className="text-sm text-gray-500">{c.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(c.startTime).toLocaleDateString()} - {new Date(c.endTime).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-600 font-bold">Problems: {c.problemsCount}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
