import React from 'react';

const Leaderboard = () => {
  // Mock data for leaderboard
  const leaderboard = [
    { rank: 1, name: 'Alice Johnson', score: 2500, contests: 15 },
    { rank: 2, name: 'Bob Smith', score: 2350, contests: 12 },
    { rank: 3, name: 'Charlie Brown', score: 2200, contests: 18 },
    { rank: 4, name: 'Diana Prince', score: 2100, contests: 10 },
    { rank: 5, name: 'Eve Wilson', score: 2000, contests: 14 }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Leaderboard</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contests</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((user) => (
              <tr key={user.rank}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.score}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.contests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
