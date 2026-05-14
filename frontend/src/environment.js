
const server = window.location.hostname === "localhost" || 
               window.location.hostname === "127.0.0.1" || 
               window.location.hostname.startsWith("192.168.")
    ? "http://localhost:8000"
    : "https://lets-meet-the-video-conferencing-app-eaur.onrender.com";

export default server;