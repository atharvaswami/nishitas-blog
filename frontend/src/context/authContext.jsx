import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    axios.defaults.withCredentials = true;
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const res = await axios.post(`${BACKEND_URL}/auth/login`, inputs, { withCredentials: true });
        document.cookie = "accessToken=" + res.data.token;
        setCurrentUser(res.data);
    };

    const logout = async () => {
        const res = await axios.post(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
        setCurrentUser(null);
        document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        alert(res.data);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
