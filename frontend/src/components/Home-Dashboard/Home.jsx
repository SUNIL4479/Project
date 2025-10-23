import React, { useState } from 'react';
import Navbar from './Navbar';
import PastContests from './PastContests';
import ScheduledContests from './ScheduledContests';
import RunningContests from './RunningContests';
import Leaderboard from './Leaderboard';

const Home = () => {
  const [activeSection, setActiveSection] = useState('');

  const renderSection = () => {
    switch (activeSection) {
      case 'past':
        return <PastContests />;
      case 'scheduled':
        return <ScheduledContests />;
      case 'running':
        return <RunningContests />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 30%; }
          }
          .animated-bg {
            background: linear-gradient(45deg, white 50%, black 50%);
            background-size: 200% 200%;
            animation: gradientShift 5s;
          }
        `}
      </style>
      <div className="min-h-screen animated-bg">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {renderSection()}
          <section className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center pt-20">
            <h3 className="sm:text-6xl text-red-800 md:text-6xl lg:text-5xl mb-6 tracking-tight">
              <span className="text-4xl font-bold">Embrace</span> <span className="text-4xl">the Competition</span>
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed">
              Challenge yourself with coding contests, compete with developers worldwide, and climb the leaderboard.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
