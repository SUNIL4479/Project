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
      // Client-side validation
      const validationErrors = [];

      if (!contestData.title.trim()) validationErrors.push('Contest title is required');
      if (!contestData.description.trim()) validationErrors.push('Contest description is required');
      if (!contestData.startTime) validationErrors.push('Start time is required');
      if (!contestData.endTime) validationErrors.push('End time is required');
      
      if (contestData.problems.length === 0) {
        // Check if there's a problem in the form that hasn't been added yet
        if (problem.title || problem.description || problem.testCases.length > 0) {
          validationErrors.push('You have a problem in the form that hasn\'t been added to the contest yet. Please click "Add Problem" button to add it.');
        } else {
          validationErrors.push('Please add at least one problem');
        }
      }

      // Validate each problem
      contestData.problems.forEach((problem, index) => {
        if (!problem.title.trim()) {
          validationErrors.push(`Problem ${index + 1}: Title is required`);
        }
        if (!problem.description.trim()) {
          validationErrors.push(`Problem ${index + 1}: Description is required`);
        }
        if (!problem.testCases || problem.testCases.length === 0) {
          validationErrors.push(`Problem ${index + 1}: At least one test case is required`);
        } else {
          problem.testCases.forEach((testCase, tIndex) => {
            if (!testCase.input.trim() || !testCase.output.trim()) {
              validationErrors.push(`Problem ${index + 1}, Test Case ${tIndex + 1}: Both input and output are required`);
            }
          });
        }
      });

      if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        return;
      }

      // Format dates
      const startDateTime = new Date(contestData.startTime);
      const endDateTime = new Date(contestData.endTime);

      // Validate dates
      if (startDateTime <= new Date()) {
        alert('Start time must be in the future');
        return;
      }

      if (endDateTime <= startDateTime) {
        alert('End time must be after start time');
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please log in to create a contest');
        navigate('/login');
        return;
      }

      const backend = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Prepare contest data
      const contestPayload = {
        ...contestData,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        problems: contestData.problems.map(problem => ({
          title: problem.title,
          description: problem.description,
          inputFormat: problem.inputFormat || '',
          outputFormat: problem.outputFormat || '',
          constraints: problem.constraints || '',
          sampleInput: problem.sampleInput || '',
          sampleOutput: problem.sampleOutput || '',
          testCases: problem.testCases.map(tc => ({
            input: tc.input,
            output: tc.output
          }))
        }))
      };

      console.log('Sending contest data:', contestPayload);

      const response = await axios.post(`${backend}/contests`, contestPayload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Contest created successfully:', response.data);
      alert('Contest created successfully!');
      navigate('/dashboard/created');
    } catch (error) {
      console.error('Failed to create contest:', error);
      if (error.response?.data?.details) {
        alert('Validation errors:\n' + error.response.data.details.join('\n'));
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to create contest. Please try again.');
      }
    }

    try {
      // Validate contest times
      const startDateTime = new Date(contestData.startTime);
      const endDateTime = new Date(contestData.endTime);
      const now = new Date();

      if (startDateTime < now) {
        alert('Contest start time must be in the future');
        return;
      }

      if (endDateTime <= startDateTime) {
        alert('Contest end time must be after start time');
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please log in to create a contest');
        navigate('/login');
        return;
      }

      const backend = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Sending contest data:', contestData);
      
      const response = await axios.post(`${backend}/contests`, 
        {
          ...contestData,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString()
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Contest created successfully:', response.data);
      alert('Contest created successfully!');
      navigate('/dashboard/created');
    } catch (error) {
      console.error('Failed to create contest:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(error.response.data.error || error.response.data.message || 'Failed to create contest');
      } else if (error.request) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Failed to create contest. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-orange-900">Create New Contests</h1>
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
