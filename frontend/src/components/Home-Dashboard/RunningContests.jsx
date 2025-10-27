import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RunningContests = () => {
  const navigate = useNavigate();
  const [runningContests, setRunningContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRunningContests = async () => {
      try {
        const backend = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${backend}/api/contests/running`);
        setRunningContests(response.data);
      } catch (error) {
        console.error('Failed to fetch running contests', error);
        setError('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    fetchRunningContests();
  }, []);

  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Running Contests</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-green-700 p-6 rounded-lg shadow-md">
            <p className="text-white">Loading contests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Running Contests</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-red-600 p-6 rounded-lg shadow-md">
            <p className="text-white">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Running Contests</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {runningContests.length === 0 ? (
          <div className="bg-green-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-white mb-2">No Running Contests</h3>
            <p className="text-white">No contests are currently active.</p>
          </div>
        ) : (
          runningContests.map((contest) => (
            <div key={contest.id} className="bg-green-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">{contest.name}</h3>
              <p className="text-white mb-2">Time Left: {calculateTimeLeft(contest.endTime)}</p>
              <p className="text-white mb-4">Problems: {contest.problemsCount}</p>
              <p className="text-white mb-4">Created by: {contest.createdBy}</p>
              <button
                onClick={() => navigate(`/contest/${contest.id}`)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Join Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RunningContests;
