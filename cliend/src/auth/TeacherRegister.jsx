import React, { useState } from "react";
import axios from "axios";

const TeacherRegister = () => {
    const API = import.meta.env.VITE_API_URI;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
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
            const res = await axios.post(`${API}/api/auth/teacher/register`, formData);
            setMessage("Teacher registered successfully!");
            setFormData({
                name: "",
                email: "",
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
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Register Teacher</h2>
                {message && (
                    <p className="mb-4 text-center text-sm text-blue-600 font-medium">{message}</p>
                )}

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                <button
                    type="submit"
                    className={`w-full text-white p-2 rounded ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register Teacher"}
                </button>
            </form>
        </div>
    );
};

export default TeacherRegister;
