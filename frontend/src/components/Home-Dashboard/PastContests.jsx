import React from 'react';

const PastContests = () => {
  // Mock data for past contests
  const pastContests = [
    { id: 1, name: 'Code Challenge 2023', date: '2023-10-15', participants: 150 },
    { id: 2, name: 'Algorithm Battle', date: '2023-09-20', participants: 200 },
    { id: 3, name: 'Data Structures Showdown', date: '2023-08-10', participants: 180 }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold sm:text-gray-800 text-white mb-6 ">Past Contests</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pastContests.map((contest) => (
          <div key={contest.id} className="bg-gray-400 p-6 rounded-lg shadow-2xl">
            <h3 className="text-xl font-semibold text-black mb-2">{contest.name}</h3>
            <p className="text-black-600 mb-2">Date: {contest.date}</p>
            <p className="text-black-600">Participants: {contest.participants}</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              View Results
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastContests;
