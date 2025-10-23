import React from 'react';

const ScheduledContests = () => {
  // Mock data for scheduled contests
  const scheduledContests = [
    { id: 1, name: 'Weekly Code Sprint', date: '2024-01-20', time: '14:00', duration: '2 hours' },
    { id: 2, name: 'Monthly Challenge', date: '2024-02-01', time: '10:00', duration: '3 hours' },
    { id: 3, name: 'Special Event Contest', date: '2024-02-15', time: '16:00', duration: '4 hours' }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Contests</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scheduledContests.map((contest) => (
          <div key={contest.id} className="bg-blue-600 p-6 rounded-lg shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">{contest.name}</h3>
            <p className="text-black-600 mb-2">Date: {contest.date}</p>
            <p className="text-black-600 mb-2">Time: {contest.time}</p>
            <p className="text-black-600 mb-4">Duration: {contest.duration}</p>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledContests;
