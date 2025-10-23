import React, { useState } from 'react';
import logo from "../LogoC.png"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const Navbar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'past', label: 'Past Contests' },
    { id: 'scheduled', label: 'Scheduled Contests' },
    { id: 'running', label: 'Running Contests' },
    { id: 'leaderboard', label: 'Leaderboard' }
  ];
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center py-2 sm:py-4">
          <img src={logo} alt="Logo" className="h-8 sm:h-12 w-auto" />
          {/* Buttons for desktop */}
          <div className="hidden sm:flex sm:space-x-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors text-base ${
                  activeSection === section.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
          {/* Mobile layout: Dashboard and Logout in middle, toggler right */}
          <div className="sm:hidden flex items-center space-x-2">
            <button className='rounded-xl px-3 py-1 bg-blue-300 hover:bg-black hover:text-white text-sm' onClick={()=> navigate("/Dashboard")}>
              Dashboard
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Desktop Dashboard and Logout */}
          <div className="hidden sm:flex sm:space-x-2">
            <button className='rounded-xl px-5 py-2 bg-blue-300 hover:bg-black hover:text-white text-base' onClick={()=> navigate("/Dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="mb-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 mb-2 rounded-md font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 mb-2 rounded-md font-medium transition-colors text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
