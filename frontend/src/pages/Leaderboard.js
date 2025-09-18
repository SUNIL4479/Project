import React from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const rankings = [
    { rank: 1, name: 'Alice', score: 1500 },
    { rank: 2, name: 'Bob', score: 1400 },
    { rank: 3, name: 'Charlie', score: 1300 },
    { rank: 4, name: 'David', score: 1200 },
    { rank: 5, name: 'Eve', score: 1100 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leaderboard</h1>
          <nav className="mt-4">
            <Link to="/" className="text-purple-600 hover:text-purple-800">Back to Contests</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {rankings.map((user) => (
                <li key={user.rank}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-lg font-medium text-gray-900">#{user.rank}</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                        Score: {user.score}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
