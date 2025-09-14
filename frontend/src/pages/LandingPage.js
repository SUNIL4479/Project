import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="bg-black text-white py-4 px-4 fixed top-0 w-full z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition duration-300">
            Contest Platform
          </Link>
          <div className="flex flex-wrap space-x-6">
            <Link to="/" className="hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white">
              Home
            </Link>
            <Link to="/leaderboard" className="hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white">
              LeaderBoard
            </Link>
            <Link to="/contests" className="hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white">
              Contests
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white">
              About
            </Link>
            <Link to="/login" className="hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white">
              Login
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen px-4 text-center pt-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Welcome to Contest Platform
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed">
          Challenge yourself with coding contests, compete with developers worldwide, and climb the leaderboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/contest"
            className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition duration-300"
          >
            View Contests
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Challenges</h3>
              <p className="text-gray-600">Solve problems across various difficulty levels and topics.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Leaderboard</h3>
              <p className="text-gray-600">Track your progress and compete with others in real-time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-gray-600">Get immediate results and detailed explanations for your solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-black text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Coding?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of developers who are improving their skills through our platform.
        </p>
        <Link
          to="/login"
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
        >
          Join Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-100 text-center">
        <p className="text-gray-600">&copy; 2023 Contest Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
