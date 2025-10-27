import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ContestParticipation = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const backend = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${backend}/api/contests/${contestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContest(response.data);

        // Calculate time left
        const endTime = new Date(response.data.endTime);
        const now = new Date();
        const timeDiff = endTime - now;
        setTimeLeft(Math.max(0, Math.floor(timeDiff / 1000)));
      } catch (error) {
        console.error('Failed to fetch contest', error);
        setError('Failed to load contest');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Contest ended
            alert('Contest has ended!');
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const backend = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      const response = await axios.post(`${backend}/api/contests/${contestId}/submit`, {
        problemIndex: currentProblem,
        code,
        language
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmissions(prev => [...prev, {
        problemIndex: currentProblem,
        language,
        status: response.data.status,
        timestamp: new Date()
      }]);

      alert(`Submission ${response.data.status}!`);
    } catch (error) {
      console.error('Failed to submit code', error);
      alert('Failed to submit code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <p>Loading contest...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">{error || 'Contest not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const problem = contest.problems[currentProblem];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{contest.title}</h1>
            <p className="text-gray-300">{contest.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono text-red-400">
              Time Left: {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Exit Contest
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Problems</h2>
              <div className="space-y-2">
                {contest.problems.map((prob, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProblem(index)}
                    className={`w-full text-left p-3 rounded ${
                      currentProblem === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{prob.title}</div>
                    <div className="text-sm text-gray-300">
                      Submissions: {submissions.filter(s => s.problemIndex === index).length}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problem Details and Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400">Description</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{problem.description}</p>
                </div>

                {problem.inputFormat && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Input Format</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{problem.inputFormat}</p>
                  </div>
                )}

                {problem.outputFormat && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Output Format</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{problem.outputFormat}</p>
                  </div>
                )}

                {problem.constraints && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Constraints</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{problem.constraints}</p>
                  </div>
                )}

                {problem.sampleInput && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Sample Input</h3>
                    <pre className="bg-gray-900 p-3 rounded text-green-400 overflow-x-auto">
                      {problem.sampleInput}
                    </pre>
                  </div>
                )}

                {problem.sampleOutput && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Sample Output</h3>
                    <pre className="bg-gray-900 p-3 rounded text-green-400 overflow-x-auto">
                      {problem.sampleOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Code Editor</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                className="w-full h-64 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Submissions: {submissions.filter(s => s.problemIndex === currentProblem).length}
                </div>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
                >
                  Submit Code
                </button>
              </div>
            </div>

            {/* Submissions */}
            {submissions.filter(s => s.problemIndex === currentProblem).length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Your Submissions</h2>
                <div className="space-y-2">
                  {submissions
                    .filter(s => s.problemIndex === currentProblem)
                    .map((submission, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                        <div>
                          <span className="font-medium">{submission.language}</span>
                          <span className="text-sm text-gray-400 ml-4">
                            {submission.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          submission.status === 'Accepted'
                            ? 'bg-green-600 text-white'
                            : submission.status === 'Wrong Answer'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestParticipation;
