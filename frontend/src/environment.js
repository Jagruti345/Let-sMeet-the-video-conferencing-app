
let IS_PROD = false;
const server = IS_PROD ?
    "https://lets-meet-the-video-conferencing-app.onrender.com" :
    "http://localhost:8000"
     



export default server;