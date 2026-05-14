import * as React from 'react';
import { 
    Avatar, Button, CssBaseline, TextField, Box, Typography, 
    ThemeProvider, createTheme, IconButton, InputAdornment, Snackbar 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Authentication() {
    const { theme, toggleTheme } = useTheme();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const muiTheme = React.useMemo(() => createTheme({
        palette: {
            mode: theme,
            primary: { main: '#6366f1' },
            secondary: { main: '#ec4899' },
            background: {
                default: theme === 'dark' ? '#020617' : '#f8fafc',
                paper: theme === 'dark' ? '#0f172a' : '#ffffff',
            }
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: { borderRadius: 16 }
    }), [theme]);

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                let result = await handleRegister(name, username, password);
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
                setPassword("");
            }
        } catch (err) {
            console.log(err);
            const msg = err.response?.data?.message || "Something went wrong. Please try again.";
            setError(msg);
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <Box sx={{ 
                height: '100vh', 
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc',
                backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme === 'dark' 
                        ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.6), rgba(15, 23, 42, 0.4))' 
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(99, 102, 241, 0.2))',
                    zIndex: 1
                }
            }}>
                <CssBaseline />
                
                <IconButton 
                    onClick={toggleTheme} 
                    sx={{ 
                        position: 'absolute', 
                        top: 30, 
                        right: 30, 
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        zIndex: 10,
                        '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
                    }}
                >
                    {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '450px',
                        mx: 2,
                        p: { xs: 4, sm: 6 },
                        borderRadius: '32px',
                        background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <VideoCallIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="900" sx={{ color: theme === 'dark' ? 'white' : '#0f172a' }}>
                            Let'sMeet
                        </Typography>
                    </Box>

                    <Typography component="h1" variant="h4" fontWeight="900" sx={{ mb: 1, textAlign: 'center', color: theme === 'dark' ? 'white' : '#0f172a' }}>
                        {formState === 0 ? "Welcome Back" : "Create Account"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme === 'dark' ? '#94a3b8' : '#475569', mb: 4, textAlign: 'center' }}>
                        {formState === 0 ? "Sign in to join high-quality video calls" : "Join Let'sMeet to start your conferencing experience"}
                    </Typography>

                    <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 4 }}>
                        <Button 
                            fullWidth 
                            variant={formState === 0 ? "contained" : "outlined"} 
                            onClick={() => { setFormState(0); setError(""); }}
                            sx={{ borderRadius: '14px', py: 1, textTransform: 'none', fontWeight: 600 }}
                        >
                            Sign In
                        </Button>
                        <Button 
                            fullWidth 
                            variant={formState === 1 ? "contained" : "outlined"} 
                            onClick={() => { setFormState(1); setError(""); }}
                            sx={{ borderRadius: '14px', py: 1, textTransform: 'none', fontWeight: 600 }}
                        >
                            Sign Up
                        </Button>
                    </Box>

                    <Box component="form" noValidate sx={{ width: '100%' }}>
                        {formState === 1 && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                value={name}
                                autoComplete="name"
                                onChange={(e) => setName(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' }, mb: 1 }}
                            />
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' }, mb: 1 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: theme === 'dark' ? '#94a3b8' : '#475569' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center', fontWeight: 600 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 4, 
                                mb: 2, 
                                py: 1.8, 
                                borderRadius: '16px', 
                                fontSize: '1rem', 
                                fontWeight: '700', 
                                textTransform: 'none',
                                background: 'var(--accent-primary)',
                                '&:hover': { background: 'var(--accent-secondary)' }
                            }}
                            onClick={handleAuth}
                        >
                            {formState === 0 ? "Login to Let'sMeet" : "Create My Account"}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </ThemeProvider>
    );
}