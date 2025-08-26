import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";

const StudentRegister = () => {
    const API = import.meta.env.VITE_API_URI;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        parentPhone: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(`${API}/api/auth/student/register`, formData);
            setMessage("Student registered successfully! Awaiting approval.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                parentPhone: "",
                password: "",
            });
        } catch (error) {
            console.error("Registration error:", error);
            setMessage(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar/>
                <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4">Student Registration</h2>
                {message && (
                    <p className="mb-4 text-sm text-center text-blue-600 font-medium">
                        {message}
                    </p>
                )}

                {["name", "email", "phone", "parentPhone", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border p-2 mb-3 rounded"
                        required
                    />
                ))}

                <button
                    type="submit"
                    className={`w-full text-white p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            <Link to="/" className="text-blue-600 hover:underline">
                Login
            </Link>
            </form>
        </div>
        </>

    );
};

export default StudentRegister;
