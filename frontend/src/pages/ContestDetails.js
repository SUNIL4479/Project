import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ContestDetails = () => {
  const { id } = useParams();

  const contest = {
    id,
    name: 'Code Challenge 1',
    date: '2023-10-01',
    status: 'Upcoming',
    problems: [
      { id: 1, title: 'Two Sum', difficulty: 'Easy' },
      { id: 2, title: 'Longest Substring', difficulty: 'Medium' },
      { id: 3, title: 'Median of Two Arrays', difficulty: 'Hard' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{contest.name}</h1>
          <nav className="mt-4">
            <Link to="/" className="text-purple-600 hover:text-purple-800">Back to Contests</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p className="text-lg mb-4">Date: {contest.date}</p>
          <p className="text-lg mb-6">Status: {contest.status}</p>
          <h2 className="text-2xl font-semibold mb-6">Problems</h2>
          <div className="space-y-4">
            {contest.problems.map(problem => (
              <div key={problem.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-medium">{problem.title}</h3>
                <p className="text-sm text-gray-600">Difficulty: {problem.difficulty}</p>
                <Link
                  to={`/contest/${id}/submit`}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Submit Solution
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContestDetails;
