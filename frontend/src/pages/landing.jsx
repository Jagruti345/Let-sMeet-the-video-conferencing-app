import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton, Box, Typography, Grid, Paper } from '@mui/material'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SecurityIcon from '@mui/icons-material/Security'
import GroupsIcon from '@mui/icons-material/Groups'
import SpeedIcon from '@mui/icons-material/Speed'
import '../App.css'
import { useTheme } from '../contexts/ThemeContext'

export default function LandingPage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const featuresRef = useRef(null);

    const generateMeetingCode = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navLogo' onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <VideoCallIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" fontWeight="800">Let'sMeet</Typography>
                </div>
                <div className='navList'>
                    <p onClick={() => {
                        const code = generateMeetingCode();
                        navigate(`/${code}`);
                    }}>Join as Guest</p>
                    
                    <IconButton onClick={toggleTheme} sx={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                        {theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </IconButton>
                    
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate("/auth")}
                        sx={{ 
                            borderColor: 'var(--glass-border)', 
                            color: 'var(--text-primary)', 
                            borderRadius: '10px', 
                            textTransform: 'none', 
                            fontWeight: 600,
                            px: 3,
                            '&:hover': { borderColor: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.05)' }
                        }}
                    >
                        Login
                    </Button>
                    
                    <Button 
                        variant="contained" 
                        onClick={() => navigate("/auth")}
                        sx={{ 
                            background: 'var(--accent-primary)', 
                            borderRadius: '10px', 
                            textTransform: 'none', 
                            fontWeight: 600,
                            px: 3,
                            '&:hover': { background: 'var(--accent-secondary)' }
                        }}
                    >
                        Sign Up
                    </Button>
                </div>
            </nav>

            <main className='landingMainContainer'>
                <div className='landingText'>
                    <h1>Connect <span className='gradient-text'>Anywhere</span>, Anytime.</h1>
                    <p>Experience crystal clear video calls, real-time collaboration, and secure meetings with our modernized conferencing platform.</p>
                    <div className='cta-buttons'>
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => navigate("/auth")}
                            sx={{ 
                                background: 'var(--accent-primary)', 
                                py: 2, 
                                px: 4, 
                                borderRadius: '14px', 
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                                '&:hover': { background: 'var(--accent-secondary)' }
                            }}
                        >
                            Get Started for Free
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            onClick={scrollToFeatures}
                            sx={{ 
                                borderColor: 'var(--glass-border)', 
                                color: 'var(--text-primary)', 
                                py: 2, 
                                px: 4, 
                                borderRadius: '14px', 
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { borderColor: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.05)' }
                            }}
                        >
                            Learn More
                        </Button>
                    </div>
                </div>

                <div className='landingImage'>
                    <div className='image-wrapper'>
                        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" alt="Collaborative Meeting" />
                        <div className='floating-card card-1'>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                            <span>Live Preview</span>
                        </div>
                        <div className='floating-card card-2'>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                            <span>100+ Participants</span>
                        </div>
                    </div>
                </div>
            </main>

            <section ref={featuresRef} className='features-section' style={{ padding: '8rem 4rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)' }}>
                <Typography variant="h3" align="center" fontWeight="900" sx={{ mb: 8, color: 'var(--text-primary)' }}>
                    Why Choose <span className="gradient-text">Let'sMeet</span>?
                </Typography>
                
                <Grid container spacing={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {[
                        { icon: <SecurityIcon />, title: 'End-to-End Encryption', desc: 'Your meetings are private and secure with state-of-the-art encryption standards.' },
                        { icon: <GroupsIcon />, title: 'Group Collaboration', desc: 'Collaborate with up to 100 participants with real-time chat and screen sharing.' },
                        { icon: <SpeedIcon />, title: 'Low Latency', desc: 'Optimized video streaming ensures smooth communication even on slower networks.' }
                    ].map((feature, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                            <Paper elevation={0} sx={{ 
                                p: 4, 
                                borderRadius: '24px', 
                                background: 'var(--bg-tertiary)', 
                                border: '1px solid var(--glass-border)',
                                textAlign: 'center',
                                height: '100%',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-10px)' }
                            }}>
                                <Box sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: '16px', 
                                    background: 'rgba(99, 102, 241, 0.1)', 
                                    color: 'var(--accent-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" fontWeight="800" gutterBottom color="var(--text-primary)">{feature.title}</Typography>
                                <Typography variant="body2" color="var(--text-secondary)">{feature.desc}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </section>
            
            <footer style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-primary)', borderTop: '1px solid var(--glass-border)' }}>
                <Typography variant="body2" color="var(--text-secondary)">
                    © 2026 Let'sMeet Video Conferencing. All rights reserved.
                </Typography>
            </footer>
        </div>
    )
}