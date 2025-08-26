import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);

    // ✅ Restore auth from localStorage on app load
    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuthData(JSON.parse(storedAuth));
        }
    }, []);

    const login = async (email, password, role) => {
        try {
            let endpoint = "";

            if (role === "student") {
                endpoint = "/api/auth/student/login";
            } else if (role === "teacher") {
                endpoint = "/api/auth/teacher/login";
            } else if (role === "admin") {
                endpoint = "/api/auth/admin/login";
            }

            const res = await axios.post(`${import.meta.env.VITE_API_URI}${endpoint}`, {
                email,
                password,
            });

            if (res.data?.token) {
                setAuthData(res.data);
                localStorage.setItem("auth", JSON.stringify(res.data));
                // console.log(res.data)

                return { success: true };
            } else {
                return {
                    success: false,
                    message: res.data?.message || "Invalid login response",
                };
            }

        } catch (err) {
            console.log("Login error:", err);
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    };

    const logout = () => {
        setAuthData(null);
        localStorage.removeItem("auth");
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
