const axios = require("axios");

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor to automatically add auth token
api.interceptors.request.use((config) => {
    // Check multiple token sources
    const token = 
        localStorage.getItem('auth_token') || 
        localStorage.getItem('google_auth_token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request:', token);
    } else {
        console.log('No token found in storage');
    }
    return config;
});

// Handle Google OAuth login
export const googleLogin = async (response) => {
    try {
        console.log('Google OAuth response:', response);
        const { credential } = response;
        
        const apiResponse = await api.post("/auth/google/callback", { 
            credential,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID 
        });
        
        const { token, user } = apiResponse.data;
        
        if (token) {
            localStorage.setItem('google_auth_token', token);
            localStorage.setItem('auth_token', token); // Store in both for compatibility
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Google auth token saved:', token);
        } else {
            console.error('No token received from server');
        }
        
        return apiResponse.data;
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};