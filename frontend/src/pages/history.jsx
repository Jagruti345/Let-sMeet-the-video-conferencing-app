import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { IconButton, Tooltip } from "@mui/material";
import '../App.css';
import { useTheme } from "../contexts/ThemeContext";

export default function History(){
    const {getHistoryOfUser} = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const { theme, toggleTheme } = useTheme();

    const routeTo = useNavigate();

    useEffect(() =>{
        const fetchHistory = async () =>{
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (error) {
                console.log(error);
            }
        }
        fetchHistory();
    },[])

    let formatDate = (dateString) =>{
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth()+1).toString().padStart(2,"0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

   return (
  <div className="history-container">
    
    <div className="history-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <IconButton 
            className="home-btn"
            onClick={() => routeTo("/home")}
          >
            <HomeIcon />
          </IconButton>
          <h2 className="history-title">Meeting History</h2>
      </div>

      <div style={{ marginLeft: 'auto' }}>
          <IconButton onClick={toggleTheme} sx={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)', borderRadius: '12px', ml: 2 }}>
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
      </div>
    </div>

    <div className="history-grid">
      {
        Array.isArray(meetings) && meetings.length > 0 ? (
          meetings.map((e) => (
            <Card key={e._id} className="history-card">

              <CardContent>
                <Typography className="history-code">
                  Code: {e.meetingCode}
                </Typography>

                <Typography className="history-date">
                  Date: {formatDate(e.date)}
                </Typography>
              </CardContent>

            </Card>
          ))
        ) : (
          <p className="no-history">No meeting history found</p>
        )
      }
    </div>

  </div>
);
}