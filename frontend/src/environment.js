
const DEFAULT_API_URL = import.meta.env.VITE_DEFAULT_API_URL || "https://lets-meet-the-video-conferencing-app.onrender.com";
const server = import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" || 
     window.location.hostname.startsWith("192.168."))
        ? "http://localhost:8000"
        : DEFAULT_API_URL;

export default server;