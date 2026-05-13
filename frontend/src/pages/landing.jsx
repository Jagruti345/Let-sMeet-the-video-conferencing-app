import React from "react";
import '../App.css';
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import VideoCallIcon from '@mui/icons-material/VideoCall';

export default function LandingPage() {
    const router = useNavigate();

    const generateMeetingCode = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    return (
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2 onClick={() => router("/")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <VideoCallIcon sx={{ fontSize: 40, color: '#6366f1' }} />
                        Let'sMeet
                    </h2>
                </div>
                <div className="navList">
                    <p onClick={() => {
                        const code = generateMeetingCode();
                        router(`/${code}`);
                    }}>Join as Guest</p>
                    <Button 
                        variant="outlined" 
                        onClick={() => router("/auth")}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '10px' }}
                    >
                        Login
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={() => router("/auth")}
                        sx={{ background: '#6366f1', borderRadius: '10px', '&:hover': { background: '#4f46e5' } }}
                    >
                        Sign Up
                    </Button>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div className="landingText">
                    <h1><span className="gradient-text">Connect</span> with anyone, anywhere.</h1>
                    <p>Experience crystal clear video calls and seamless collaboration with Let'sMeet.</p>
                    <div className="cta-buttons">
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={() => {
                                if (localStorage.getItem("token")) {
                                    router("/home");
                                } else {
                                    router("/auth");
                                }
                            }}
                            sx={{ background: '#6366f1', px: 4, py: 1.5, borderRadius: '12px', fontSize: '1.1rem' }}
                        >
                            Get Started
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large"
                            onClick={() => {
                                const code = generateMeetingCode();
                                router(`/${code}`);
                            }}
                            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', px: 4, py: 1.5, borderRadius: '12px', fontSize: '1.1rem' }}
                        >
                            Join Guest Meeting
                        </Button>
                    </div>
                </div>
                <div className="landingImage">
                    <div className="image-wrapper">
                        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1974&auto=format&fit=crop" alt="Video Call" />
                        <div className="floating-card card-1">
                            <span>🚀 Fast & Secure</span>
                        </div>
                        <div className="floating-card card-2">
                            <span>🎥 HD Quality</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}