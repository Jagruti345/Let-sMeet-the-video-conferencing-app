import React from "react";
import '../App.css';
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
    
    const router = useNavigate();
    const generateMeetingCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

    return (
        <div className="landingPageContainer">
           <nav>
            <div className="navHeader">
                <h2 onClick={()=>{
                    router("/");
                }}>Let'sMeet</h2>
            </div>
            <div className="navList">
                <p onClick ={()=>{
                    const code = generateMeetingCode();
                    router(`/${code}`);
                }}>Join as Guest</p>
                <p onClick={()=>{
                    router("/auth");
                }}>Register</p>
                <p onClick={()=>{
                    router("/auth");
                }}>Login</p>
            </div>
           </nav>

           <div className="landingMainContainer">
                <div>
                    <h1><span style={{color: "#ff9839"}}>Connect</span> with your loved ones</h1>

                    <p>Cover Distance by Let'sMeet</p>
                    <div role="button">
                        <Link to={'/home'}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src="/mobile.png" alt="mobile"/>
                </div>
           </div>
        </div>
    );
}