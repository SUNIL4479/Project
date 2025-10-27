import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    
  });
  const [profilePic, setProfilePicFile] = useState(null);
  const backendBase = process.env.REACT_APP_API_URL
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Check both URL parameters and session storage for tokens
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const googleToken = localStorage.getItem('google_auth_token');
    
    console.log('Checking tokens - URL:', urlToken, 'Google:', googleToken);

    if (urlToken) {
      // If token is in URL, save it and clean up the URL
      localStorage.setItem('auth_token', urlToken);
      console.log('Token from URL saved:', urlToken);
      window.history.replaceState({}, document.title, '/Home');
      navigate('/Home');
    } else if (googleToken) {
      // If Google token exists, use it
      localStorage.setItem('auth_token', googleToken);
      console.log('Using Google token:', googleToken);
      navigate('/Home');
    }
  }, [navigate]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const githubLogin = () => {
    const clientId = 'Ov23liakOWNLgpXCXhrY';
    const redirectUri = `${window.location.origin}/github-callback`;
    const scope = 'user';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    const popup = window.open(authUrl, 'github-auth', 'width=500,height=600');

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'GITHUB_AUTH_SUCCESS') {
        console.log('GitHub login success:', event.data.code);
        // Here you can send the code to your backend or handle user authentication
        // For now, just close the modal
        onClose();
        popup.close();
      }
    };

    window.addEventListener('message', handleMessage);

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '', api: '' }); // Clear error on change
  };

  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
    setErrors({ ...errors, profilePic: '' }); // Clear error on change
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (!formData.username) newErrors.username = 'username is required';
      if (!profilePic) newErrors.profilePic = 'Profile picture is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isLogin) {
          // Login
          const response = await fetch(`${backendBase}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
          });
          const data = await response.json();
          console.log('Login data:', data);
          if (response.ok) {
            localStorage.setItem('auth_token', data.token);
            console.log('Token saved:', data.token);
            onClose();
            navigate('/Home');
          } else {
            setErrors({ ...errors, api: data.message || 'Login failed' });
          }
        } else {
          // Sign up
          const formDataToSend = new FormData();
          formDataToSend.append('username', formData.username);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('password', formData.password);
          if (profilePic) {
            formDataToSend.append('profilePic', profilePic);
          }
          console.log('Attempting to register with:', {
            username: formData.username,
            email: formData.email,
            hasProfilePic: !!profilePic
          });
          
          try {
            const response = await fetch(`${backendBase}/api/register`, {
              method: 'POST',
              body: formDataToSend,
              headers: {
                // Don't set Content-Type header when sending FormData
                // Let the browser set it automatically with the correct boundary
                'Content-Type': 'application/json'
              },
            });
            
            console.log('Registration response status:', response.status);
            
            // Try to get the response text first
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            // Then parse it as JSON if possible
            let data;
            try {
              data = JSON.parse(responseText);
              console.log('Parsed response data:', data);
            } catch (e) {
              console.error('Failed to parse response as JSON:', responseText);
              throw new Error('Server returned invalid JSON');
            }
          
            if (response.ok) {
              console.log('Registration successful');
              localStorage.setItem('auth_token', data.token);
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/Home');
              }, 2000);
            } else {
              const errorMessage = data.error || data.message || 'Registration failed';
              setErrors({ ...errors, api: errorMessage });
            }
          } catch (registrationError) {
            console.error('Registration error:', registrationError);
            setErrors({ ...errors, api: 'Registration failed. Please try again.' });
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors({ ...errors, api: 'An unexpected error occurred' });
      }
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 px-4 sm:px-4 lg:px-5" onClick={handleOverlayClick}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-300 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-l-lg font-semibold transition ${isLogin ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-r-lg font-semibold transition ${!isLogin ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Sign Up
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
    <div className="flex justify-between items-center gap-4 mb-4">
      <button
        onClick={() => window.location.href = `${backendBase}/auth/google`}
        className="w-1/2 bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </button>
  <button
        onClick={() => githubLogin()}
        className="w-1/2 bg-black text-white py-3 rounded-lg font-semibold border border-gray-600 hover:bg-gray-700 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        
      </button>
    </div>
        <div className="relative mb-4">
          <hr className="border-gray-300" />
          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500 text-sm">or</span>
        </div>

        <form onSubmit={handleSubmit} className='text-black'>
          {!isLogin && (
            <div>

              <label className="block text-gray-700 mb-2 font-medium" htmlFor="username">Username</label>
              <input type='text' id="username" name="username" value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John Doe" />
                   {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
          )}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="profilePic">Profile Picture</label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {errors.profilePic && <p className="text-red-500 text-sm mt-1">{errors.profilePic}</p>}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">Email </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="you@example.com"
              />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="********"
              />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {errors.api && <p className="text-red-500 text-sm mt-1">{errors.api}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold "
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60 transition-opacity duration-500">
          <div className="bg-black p-4 sm:p-8 mx-4 rounded-xl w-full max-w-md border relative flex flex-col items-center animate-bounce">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-white font-semibold text-sm sm:text-base">Account created successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default LoginModal;
