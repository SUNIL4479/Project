import React from 'react';
import { Link } from 'react-router-dom';

const ContestList = () => {
  const contests = [
    { id: 1, name: 'Code Challenge 1', date: '2023-10-01', status: 'Upcoming' },
    { id: 2, name: 'Algorithm Battle', date: '2023-09-15', status: 'Ongoing' },
    { id: 3, name: 'Hackathon 2023', date: '2023-08-20', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Online Contest Platform</h1>
          <nav className="mt-4 flex flex-wrap gap-4">
            <Link to="/login" className="text-purple-600 hover:text-purple-800">Login</Link>
            <Link to="/leaderboard" className="text-purple-600 hover:text-purple-800">Leaderboard</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold mb-6">Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map(contest => (
              <div key={contest.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">{contest.name}</h3>
                  <p className="text-sm text-gray-500">Date: {contest.date}</p>
                  <p className="text-sm text-gray-500">Status: {contest.status}</p>
                  <Link
                    to={`/contest/${contest.id}`}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContestList;
