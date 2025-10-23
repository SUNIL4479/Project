import React, { useState } from 'react';

const CreateQuestion = () => {
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: '',
    difficulty: 'easy',
    tags: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!questionData.title.trim()) newErrors.title = 'Question title is required';
    if (!questionData.description.trim()) newErrors.description = 'Description is required';
    if (!questionData.optionA.trim()) newErrors.optionA = 'Option A is required';
    if (!questionData.optionB.trim()) newErrors.optionB = 'Option B is required';
    if (!questionData.optionC.trim()) newErrors.optionC = 'Option C is required';
    if (!questionData.optionD.trim()) newErrors.optionD = 'Option D is required';
    if (!questionData.correctOption) newErrors.correctOption = 'Correct option is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // TODO: Send to backend API
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Assuming JWT auth
        },
        body: JSON.stringify(questionData)
      });

      if (response.ok) {
        alert('Question created successfully!');
        setQuestionData({
          title: '',
          description: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctOption: '',
          difficulty: 'easy',
          tags: ''
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to create question'}`);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      alert('An error occurred while creating the question');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Question</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Question Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={questionData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter question title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Question Description
            </label>
            <textarea
              id="description"
              name="description"
              value={questionData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter detailed question description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="optionA">
                Option A
              </label>
              <input
                type="text"
                id="optionA"
                name="optionA"
                value={questionData.optionA}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Option A"
              />
              {errors.optionA && <p className="text-red-500 text-sm mt-1">{errors.optionA}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="optionB">
                Option B
              </label>
              <input
                type="text"
                id="optionB"
                name="optionB"
                value={questionData.optionB}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Option B"
              />
              {errors.optionB && <p className="text-red-500 text-sm mt-1">{errors.optionB}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="optionC">
                Option C
              </label>
              <input
                type="text"
                id="optionC"
                name="optionC"
                value={questionData.optionC}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Option C"
              />
              {errors.optionC && <p className="text-red-500 text-sm mt-1">{errors.optionC}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="optionD">
                Option D
              </label>
              <input
                type="text"
                id="optionD"
                name="optionD"
                value={questionData.optionD}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Option D"
              />
              {errors.optionD && <p className="text-red-500 text-sm mt-1">{errors.optionD}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correctOption">
              Correct Option
            </label>
            <select
              id="correctOption"
              name="correctOption"
              value={questionData.correctOption}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select correct option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            {errors.correctOption && <p className="text-red-500 text-sm mt-1">{errors.correctOption}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={questionData.difficulty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={questionData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., algorithms, arrays, strings"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            Create Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
