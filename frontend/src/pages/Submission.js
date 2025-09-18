import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Submission = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    alert('Solution submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Submit Solution</h1>
          <nav className="mt-4">
            <a href={`/contest/${id}`} className="text-purple-600 hover:text-purple-800">Back to Contest</a>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="code">Your Code</label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows="10"
                placeholder="Paste your code here..."
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Submission;
