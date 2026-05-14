import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import '../App.css';
import { Button, IconButton, TextField, Box, Typography, Paper, Tooltip } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");   
    const { addToUserHistory, userData } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();

    let handleJoinVideoCall = async () => {
        let trimmedCode = meetingCode.trim();
        if (!trimmedCode) return;

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
                <div style={{ display: "flex", alignItems: "center", gap: '15px' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <VideoCallIcon sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Typography variant="h5" fontWeight="800">Let'sMeet</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Typography variant="body1" sx={{ mr: 2, color: 'var(--text-secondary)', fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
                        Hello, {userData?.name || "User"}
                    </Typography>
                    
                    <IconButton onClick={toggleTheme} sx={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                        {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    <Tooltip title="History">
                        <IconButton 
                            onClick={() => navigate("/history")}
                            sx={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', borderRadius: '12px' }}
                        >
                            <RestoreIcon />
                        </IconButton>
                    </Tooltip>

                    <Button 
                        variant="outlined"
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = "/auth";
                        }}
                        startIcon={<LogoutIcon />}
                        sx={{ 
                            borderColor: 'var(--glass-border)', 
                            color: 'var(--text-primary)', 
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                            '&:hover': {
                                borderColor: 'var(--accent-primary)',
                                background: 'rgba(99, 102, 241, 0.05)'
                            }
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <Box sx={{ maxWidth: '600px' }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 3, letterSpacing: '-1.5px', color: 'var(--text-primary)' }}>
                            Premium video <span className="gradient-text">meetings</span> for everyone.
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'var(--text-secondary)', mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
                            Connect, collaborate, and celebrate from anywhere with Let'sMeet. We've re-imagined the service for modern real-time communication.
                        </Typography>

                        <Box sx={{ display: "flex", gap: "20px", flexWrap: 'wrap' }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={handleCreateMeeting}
                                startIcon={<VideoCallIcon />}
                                sx={{ 
                                    background: 'var(--accent-primary)', 
                                    px: 4, 
                                    py: 2, 
                                    borderRadius: '16px', 
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    '&:hover': { background: 'var(--accent-secondary)' },
                                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                                }}
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
                                    placeholder="Enter code or link"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <KeyboardIcon sx={{ mr: 1, color: 'var(--text-secondary)' }} />,
                                    }}
                                    sx={{ 
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: '16px',
                                        '& .MuiOutlinedInput-root': {
                                            color: 'var(--text-primary)',
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: 'var(--glass-border)' },
                                            '&:hover fieldset': { borderColor: 'var(--accent-primary)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--accent-primary)' },
                                        }
                                    }}
                                />
                                <Button 
                                    onClick={handleJoinVideoCall} 
                                    disabled={!meetingCode}
                                    sx={{ 
                                        color: meetingCode ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        textTransform: 'none'
                                    }}
                                >
                                    Join
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid var(--glass-border)' }}>
                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                <span 
                                    style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                                    onClick={() => navigate("/")}
                                >Learn more</span> about Let'sMeet security and privacy.
                            </Typography>
                        </Box>
                    </Box>
                </div>
                <div className="rightPanel">
                    <Paper elevation={0} sx={{ 
                        borderRadius: '40px', 
                        overflow: 'hidden', 
                        background: 'transparent',
                        boxShadow: 'var(--shadow-primary)',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <img src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1974&auto=format&fit=crop" alt="Meeting" style={{ width: '100%', display: 'block' }} />
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);