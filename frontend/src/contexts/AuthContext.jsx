import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server.replace(/\/$/, "")}/api/v1`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})


export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("users/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                if (request.data.token) {
                    localStorage.setItem("token", request.data.token);
                    setUserData(request.data.user);
                    router("/home");
                }
                return request.data.message;
            }
        } catch (err) {
            throw err.response?.data || err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("users/login", {
                username: username,
                password: password
            });

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                setUserData(request.data.user);
                router("/home")
            }
        } catch (err) {
            throw err.response?.data || err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("users/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data;
        } catch (err) {
            throw err.response?.data || err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("users/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request;
        } catch (e) {
            throw e.response?.data || e;
        }
    }


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}