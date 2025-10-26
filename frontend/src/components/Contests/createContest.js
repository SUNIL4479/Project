import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateContest() {
  const [contestData, setContestData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    problems: [],
  });
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    testCases: [],
  });
  const [testCase, setTestCase] = useState({
    input: '',
    output: '',
  });
  const navigate = useNavigate();

  const handleContestChange = (e) => {
    setContestData({ ...contestData, [e.target.name]: e.target.value });
  };

  const handleProblemChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (e) => {
    setTestCase({ ...testCase, [e.target.name]: e.target.value });
  };

  const addTestCase = () => {
    setProblem({
      ...problem,
      testCases: [...problem.testCases, testCase],
    });
    setTestCase({ input: '', output: '' });
  };

  const addProblem = () => {
    setContestData({
      ...contestData,
      problems: [...contestData.problems, problem],
    });
    setProblem({
      title: '',
      description: '',
      inputFormat: '',
      outputFormat: '',
      constraints: '',
      sampleInput: '',
      sampleOutput: '',
      testCases: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const backend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      await axios.post(`${backend}/contests`, contestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard/created');
    } catch (error) {
      console.error('Failed to create contest', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-orange-900">Create New Contest</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contest Details */}
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Contest Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">Title</label>
              <input
                type="text"
                name="title"
                value={contestData.title}
                onChange={handleContestChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Description</label>
              <textarea
                name="description"
                value={contestData.description}
                onChange={handleContestChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={contestData.startTime}
                onChange={handleContestChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={contestData.endTime}
                onChange={handleContestChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Problem Details */}
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Add Problem</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Problem Title</label>
              <input
                type="text"
                name="title"
                value={problem.title}
                onChange={handleProblemChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Description</label>
              <textarea
                name="description"
                value={problem.description}
                onChange={handleProblemChange}
                rows="4"
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Input Format</label>
                <textarea
                  name="inputFormat"
                  value={problem.inputFormat}
                  onChange={handleProblemChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Output Format</label>
                <textarea
                  name="outputFormat"
                  value={problem.outputFormat}
                  onChange={handleProblemChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Constraints</label>
              <textarea
                name="constraints"
                value={problem.constraints}
                onChange={handleProblemChange}
                rows="2"
                className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Sample Input</label>
                <textarea
                  name="sampleInput"
                  value={problem.sampleInput}
                  onChange={handleProblemChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Sample Output</label>
                <textarea
                  name="sampleOutput"
                  value={problem.sampleOutput}
                  onChange={handleProblemChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-white">Test Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Input</label>
                <textarea
                  name="input"
                  value={testCase.input}
                  onChange={handleTestCaseChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Output</label>
                <textarea
                  name="output"
                  value={testCase.output}
                  onChange={handleTestCaseChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 bg-black border border-white text-white rounded-md shadow-sm focus:outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addTestCase}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Add Test Case
            </button>
          </div>

          <button
            type="button"
            onClick={addProblem}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Add Problem
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
        >
          Create Contest
        </button>
      </form>
    </div>
  );
}
