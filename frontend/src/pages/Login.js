import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
