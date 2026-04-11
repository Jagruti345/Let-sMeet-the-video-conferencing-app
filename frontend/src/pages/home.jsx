import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import '../App.css';
import { Button, Icon, IconButton, TextField } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");   

    const {addToUserHistory} = useContext(AuthContext);

    let handleJoinVideoCall =async () =>{
        try{
            await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`) ;
        }catch(err){
             console.log("Backend not connected", err);
        }
    }

    return (
        <>
        <div className="navBar">
            <div style={{display: "flex",alignItems: "center"}}>
                <h2>Let'sMeet</h2>
            </div>
            <div style={{display: "flex",alignItems: "center"   }}>
                <IconButton onClick={()=>{
                    navigate("/history")
                }}>
                    <RestoreIcon />
                </IconButton>
                <p>History</p>
                <Button onClick={() =>{
                    localStorage.removeItem('token')
                    navigate('/auth')
                }}>
                    Logout
                </Button>
            </div>
        </div>

        <div className="meetContainer">
            <div className="leftPanel">
                <div>
                    <h2>Provideing Quality Video Call Just Like Quality Education</h2>

                    <div style={{display: "flex", gap: "10px"}}>
                        <TextField onChange={e => setMeetingCode(e.target.value)} value={meetingCode} label="Enter Meeting Code" variant="outlined"></TextField>
                        <Button onClick={handleJoinVideoCall} variant="contained">Join</Button>
                    </div>
                </div>
            </div>
            <div className="rightPanel">
                <img srcSet='/logo3.png' alt="logo" />
            </div>
        </div>
        </>
    );
}

export default withAuth(HomeComponent);