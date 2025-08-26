import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { Link } from 'react-router-dom';


const AdminLogin = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password, "student");
      
      
        if (result.success) {
            navigate("/student");

        } else {
            setError(result.message);
        }
    };

    return (
        <>
            <Navbar />
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
           
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Student Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Login
                </button>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
            </form>
        </div>
        </>
    );
};

export default AdminLogin;
