import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyAttendance = () => {
    const { authData } = useAuth();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const API = import.meta.env.VITE_API_URI;

    const fetchAttendance = async () => {
        try {
            const studentId = authData.student?.id;
            if (!studentId) return;

            const res = await axios.get(`${API}/api/attendence/student/${studentId}`);
            setAttendanceRecords(res.data || []);
        } catch (err) {
            console.error("Failed to fetch attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [authData]);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading attendance...</div>;
    }

    if (attendanceRecords.length === 0) {
        return <div className="p-6 text-center text-gray-500">No attendance records found.</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Attendance</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow overflow-hidden">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left">Lecture</th>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {attendanceRecords.map((att) => (
                            <tr key={att._id} className="border-b hover:bg-gray-100">
                                <td className="px-6 py-3">{att.lecture?.name || "N.A"}</td>
                                <td className="px-6 py-3">
                                    {new Date(att.createdAt).toLocaleDateString()}{" "}
                                    <span className="text-sm text-gray-400">
                                        {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    {att.status === "Present" ? (
                                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full">
                                            Present
                                        </span>
                                    ) : att.status === "Absent" ? (
                                        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 text-sm rounded-full">
                                            Absent
                                        </span>
                                    ) : (
                                        <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 text-sm rounded-full">
                                            Not Recorded
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAttendance;
