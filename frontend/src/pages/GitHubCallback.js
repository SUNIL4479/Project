import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      console.log('GitHub login success:', code);
      // Here you can send the code to your backend or handle user authentication
      // For now, redirect to home
      window.location.href = '/';
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing GitHub authentication...</p>
    </div>
  );
};

export default GitHubCallback;
