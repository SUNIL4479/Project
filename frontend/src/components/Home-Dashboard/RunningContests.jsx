import React from 'react';

const RunningContests = () => {
  // Mock data for running contests
  const runningContests = [
    { id: 1, name: 'Live Coding Challenge', timeLeft: '1h 30m', participants: 120 },
    { id: 2, name: 'Speed Programming', timeLeft: '45m', participants: 85 }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Running Contests</h2>
      <div className="grid gap-4 md:grid-cols-2 ">
        {runningContests.map((contest) => (
          <div key={contest.id} className="bg-green-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-white mb-2">{contest.name}</h3>
            <p className="text-black-700 mb-2">Time Left: {contest.timeLeft}</p>
            <p className="text-black-700 mb-4">Active Participants: {contest.participants}</p>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-white-800 transition-colors">
              Join Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunningContests;
