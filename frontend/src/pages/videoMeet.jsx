import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField, Paper, Typography, Box, Tooltip } from "@mui/material";
import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import ClearIcon from '@mui/icons-material/Clear';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import server from '../environment';
import { useTheme } from "../contexts/ThemeContext";

const server_url = server;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const { theme, toggleTheme } = useTheme();
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(false);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  useEffect(() => {
    const handleUnload = () => {
      cleanupConnections();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      cleanupConnections();
    };
  }, []);

  useEffect(() => {
    getPermissions();
  }, []);

  let routeTo = useNavigate();

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }),
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        if (!connections[fromId]) {
          initializeConnection(fromId);
        }

        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        if (!connections[fromId]) {
            initializeConnection(fromId);
        }
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const initializeConnection = (socketListId, name) => {
    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

    connections[socketListId].onicecandidate = function (event) {
        if (event.candidate != null) {
            socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
            );
        }
    };

    connections[socketListId].onaddstream = (event) => {
        let videoExists = videoRef.current.find(
            (video) => video.socketId === socketListId,
        );

        if (videoExists) {
            setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                    video.socketId === socketListId
                        ? { ...video, stream: event.stream, name: name }
                        : video,
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
            });
        } else {
            let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                name: name,
                autoplay: true,
                playsinline: true,
            };

            setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
            });
        }
    };

    connections[socketListId].oniceconnectionstatechange = () => {
      if (
        connections[socketListId].iceConnectionState === "failed" ||
        connections[socketListId].iceConnectionState === "disconnected" ||
        connections[socketListId].iceConnectionState === "closed"
      ) {
        setVideos((videos) => {
          const updatedVideos = videos.filter((video) => video.socketId !== socketListId);
          videoRef.current = updatedVideos;
          return updatedVideos;
        });
        if (connections[socketListId]) {
          connections[socketListId].close();
          delete connections[socketListId];
        }
      }
    };

    if (window.localStream !== undefined && window.localStream !== null) {
        connections[socketListId].addStream(window.localStream);
    } else {
        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
        window.localStream = blackSilence();
        connections[socketListId].addStream(window.localStream);
    }
  }

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      const meetingId = window.location.pathname.split("/").pop();
      socketRef.current.emit("join-call", meetingId, username);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        console.log("User left:", id);
        setVideos((prevVideos) => {
          const updatedVideos = prevVideos.filter((v) => v.socketId !== id);
          videoRef.current = updatedVideos;
          return updatedVideos;
        });

        if (connections[id]) {
          connections[id].close();
          delete connections[id];
        }
      });

      socketRef.current.on("user-joined", (id, clients, participants) => {
        clients.forEach((socketListId) => {
          if (!connections[socketListId]) {
            initializeConnection(socketListId, participants[socketListId]);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => setVideo(!video);
  let handleAudio = () => setAudio(!audio);

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let handleScreen = () => setScreen(!screen);

  const cleanupConnections = () => {
    try {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    } catch (e) {
      console.log("Error stopping tracks:", e);
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    for (let id in connections) {
      if (connections[id]) {
        connections[id].close();
        delete connections[id];
      }
    }
  };

  let handleEndCall = () => {
    cleanupConnections();
    routeTo("/home");
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div className={styles.meetVideoContainer}>
      {askForUsername === true ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          padding: '20px'
        }}>
          <Paper elevation={24} sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: '32px', 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--glass-border)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            color: 'var(--text-primary)'
          }}>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>Ready to join?</Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'var(--text-secondary)' }}>Check your audio and video before entering</Typography>
            
            <Box sx={{ 
              mb: 4, 
              borderRadius: '24px', 
              overflow: 'hidden', 
              background: '#000', 
              aspectRatio: '16/9', 
              border: '4px solid var(--accent-primary)',
              position: 'relative'
            }}>
               <video ref={localVideoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
               {!videoAvailable && (
                 <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
                    <VideocamOffIcon sx={{ fontSize: 48, color: 'white' }} />
                 </Box>
               )}
            </Box>

            <TextField
              fullWidth
              label="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary)',
                    borderRadius: '16px',
                    '& fieldset': { borderColor: 'var(--glass-border)' },
                    '&:hover fieldset': { borderColor: 'var(--accent-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--accent-primary)' },
                },
                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' }
              }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={connect}
              disabled={!username.trim()}
              sx={{ 
                py: 2, 
                borderRadius: '16px', 
                background: 'var(--accent-primary)', 
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                '&:hover': { background: 'var(--accent-secondary)' }
              }}
            >
              Join Meeting
            </Button>
          </Paper>
        </div>
      ) : (
        <>
          <div className={styles.videoHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VideocamIcon sx={{ color: 'white' }} />
                  </Box>
                  <div>
                    <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>Let'sMeet</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>ID: {window.location.pathname.split('/').pop()}</Typography>
                  </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                  <IconButton onClick={toggleTheme} sx={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                      {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                  <IconButton onClick={() => { setModal(!showModal); setNewMessages(0); }} sx={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                      <Badge badgeContent={newMessages} color="error">
                          <ChatIcon />
                      </Badge>
                  </IconButton>
              </div>
          </div>

          <div className={styles.conferenceView}>
            {videos.map((video) => (
              <div key={video.socketId} className={styles.videoCard}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                ></video>
                <div className={styles.videoLabel}>{video.name || "Participant"}</div>
              </div>
            ))}
          </div>

          <video
            className={styles.meetUserVideo}
            ref={localVideoRef}
            autoPlay
            muted
          ></video>

          {showModal && (
            <div className={styles.chatRoom}>
              <div className={styles.chatHeader}>
                <Typography variant="h6" fontWeight="800">Messages</Typography>
                <IconButton onClick={() => setModal(false)} sx={{ color: 'var(--text-primary)' }}>
                    <ClearIcon />
                </IconButton>
              </div>

              <div className={styles.chattingDisplay}>
                {messages.length !== 0 ? (
                  messages.map((item, index) => (
                    <div key={index} className={styles.messageBox} style={{ alignSelf: item.sender === username ? 'flex-end' : 'flex-start', background: item.sender === username ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: item.sender === username ? 'white' : 'var(--text-primary)' }}>
                      <span className={styles.messageSender} style={{ color: item.sender === username ? 'rgba(255,255,255,0.8)' : 'var(--accent-primary)' }}>{item.sender === username ? 'You' : item.sender}</span>
                      <p className={styles.messageText}>{item.data}</p>
                    </div>
                  ))
                ) : (
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                    <ChatIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography>No messages yet</Typography>
                  </Box>
                )}
              </div>

              <div className={styles.chattingArea}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type something..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <IconButton onClick={sendMessage} sx={{ background: 'var(--accent-primary)', color: 'white', '&:hover': { background: 'var(--accent-secondary)' } }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          )}

          <div className={styles.buttonContainers}>
            <Tooltip title={video ? "Turn off camera" : "Turn on camera"}>
                <div className={`${styles.controlButton} ${!video ? styles.danger : ''}`} onClick={handleVideo}>
                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                </div>
            </Tooltip>
            
            <Tooltip title={audio ? "Mute microphone" : "Unmute microphone"}>
                <div className={`${styles.controlButton} ${!audio ? styles.danger : ''}`} onClick={handleAudio}>
                    {audio ? <MicIcon /> : <MicOffIcon />}
                </div>
            </Tooltip>

            {screenAvailable && (
              <Tooltip title={screen ? "Stop sharing" : "Share screen"}>
                  <div className={`${styles.controlButton} ${screen ? styles.active : ''}`} onClick={handleScreen}>
                    {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                  </div>
              </Tooltip>
            )}

            <Tooltip title="Leave Meeting">
                <div className={`${styles.controlButton} ${styles.danger}`} onClick={handleEndCall}>
                    <CallEndIcon />
                </div>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
}
