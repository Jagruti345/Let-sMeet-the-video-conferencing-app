
let IS_PROD = true;
const server = IS_PROD ?
    "https://lets-meet-the-video-conferencing-app.onrender.com" :
    "http://localhost:8000"
     



export default server;