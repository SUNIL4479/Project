import React , {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from "react-router-dom";
import axios from 'axios';

export default function AuthSuccess(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null)
    const [error, setError] = useState(null)
    useEffect(()=>{
        const token = searchParams.get("token");
        if(!token){
            setError("No token provided");
            return;
        }
        localStorage.setItem("auth_token",token);

        const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        axios.get(`${backend}/profile`,{
            headers : {Authorization : `Bearer ${token}`}
        }).then(res=>{
            setProfile(res.data);
            navigate('/Home');
        }).catch(err=>{
            setError("Failed to fetch profile");
        })
    },[searchParams,navigate]);
    
    if(error) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><h2>Error</h2></div>
    if(!profile) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><h2>Loading...</h2></div>

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Authentication Successful!</h2>
                <h2 className="mb-4">Welcome, {profile.username}!</h2>
                <img src={profile.ProfilePic} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
                <p className="mb-4">{JSON.stringify(profile,null,2)}</p>
            
                </div>
        </div>)}