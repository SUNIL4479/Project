import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduledContests = () => {
  const [scheduledContests, setScheduledContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduledContests = async () => {
      try {
        const backend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${backend}/api/contests/scheduled`);
        setScheduledContests(response.data);
      } catch (error) {
        console.error('Failed to fetch scheduled contests', error);
        setError('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledContests();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Contests</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-blue-600 p-6 rounded-lg shadow-2xl">
            <p className="text-white">Loading contests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Contests</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-red-600 p-6 rounded-lg shadow-2xl">
            <p className="text-white">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Contests</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scheduledContests.length === 0 ? (
          <div className="bg-blue-600 p-6 rounded-lg shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Contests</h3>
            <p className="text-white">Check back later for upcoming contests.</p>
          </div>
        ) : (
          scheduledContests.map((contest) => (
            <div key={contest.id} className="bg-blue-600 p-6 rounded-lg shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">{contest.name}</h3>
              <p className="text-white mb-2">Date: {contest.date}</p>
              <p className="text-white mb-2">Time: {contest.time}</p>
              <p className="text-white mb-4">Duration: {contest.duration}</p>
              <p className="text-white mb-4">Problems: {contest.problemsCount}</p>
              <p className="text-white mb-4">Created by: {contest.createdBy}</p>
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Register
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledContests;
