import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import '../App.css';
import { Button, IconButton, TextField, Box, Typography, Paper } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");   
    const { addToUserHistory, userData } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        let trimmedCode = meetingCode.trim();
        if (!trimmedCode) return;

        // If it's a full URL, extract the code (last segment)
        try {
            if (trimmedCode.includes("://") || trimmedCode.includes("/")) {
                const urlParts = trimmedCode.split("/");
                trimmedCode = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
            }
        } catch (e) {
            console.log("Error parsing URL", e);
        }
        
        if (!trimmedCode) return;
        
        try {
            // Try to add to history but don't let it block navigation
            addToUserHistory(trimmedCode).catch(err => {
                console.log("History sync failed", err);
            });
            
            navigate(`/${trimmedCode}`);
        } catch (err) {
            console.log("Navigation failed", err);
            window.location.href = `/${trimmedCode}`;
        }
    }

    const handleCreateMeeting = () => {
        const code = Math.random().toString(36).substring(2, 8);
        navigate(`/${code}`);
    }

    return (
        <div className="home-wrapper">
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                    <VideoCallIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                    <h2 style={{ margin: 0, fontWeight: 700 }}>Let'sMeet</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                        Hello, {userData?.name || "User"}
                    </Typography>
                    <IconButton 
                        onClick={() => navigate("/history")}
                        sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}
                    >
                        <RestoreIcon />
                        <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>History</Typography>
                    </IconButton>
                    <Button 
                        variant="outlined"
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = "/auth";
                        }}
                        startIcon={<LogoutIcon />}
                        sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '10px' }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <Box sx={{ maxWidth: '550px' }}>
                        <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 3, color: 'white' }}>
                            Premium video meetings. Now free for everyone.
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, fontWeight: 400 }}>
                            We re-engineered the service we built for secure business meetings, Let'sMeet, to make it free and available for all.
                        </Typography>

                        <Box sx={{ display: "flex", gap: "20px", flexWrap: 'wrap' }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={handleCreateMeeting}
                                startIcon={<VideoCallIcon />}
                                sx={{ background: '#6366f1', px: 3, py: 1.5, borderRadius: '10px', fontWeight: 600 }}
                            >
                                New Meeting
                            </Button>
                            
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <TextField 
                                    value={meetingCode}
                                    onChange={e => setMeetingCode(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleJoinVideoCall();
                                        }
                                    }}
                                    placeholder="Enter a code or link"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <KeyboardIcon sx={{ mr: 1, color: '#94a3b8' }} />,
                                    }}
                                    sx={{ 
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '10px',
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                                        }
                                    }}
                                />
                                <Button 
                                    onClick={handleJoinVideoCall} 
                                    disabled={!meetingCode}
                                    sx={{ 
                                        color: meetingCode ? '#6366f1' : 'rgba(255,255,255,0.3)',
                                        fontWeight: 600,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Join
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                <span 
                                    style={{ color: '#6366f1', cursor: 'pointer' }}
                                    onClick={() => navigate("/")}
                                >Learn more</span> about Let'sMeet
                            </Typography>
                        </Box>
                    </Box>
                </div>
                <div className="rightPanel">
                    <Paper elevation={24} sx={{ 
                        borderRadius: '24px', 
                        overflow: 'hidden', 
                        background: 'transparent',
                        boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.7)'
                    }}>
                        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1974&auto=format&fit=crop" alt="Meeting" style={{ width: '100%', display: 'block' }} />
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);