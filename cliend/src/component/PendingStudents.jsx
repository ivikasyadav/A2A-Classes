import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState({});
    const [deleting, setDeleting] = useState({}); // Track deletion loading

    const API = import.meta.env.VITE_API_URI;

    const fetchPendingStudents = async () => {
        try {
            const res = await axios.get(`${API}/api/student/pendingstudent`);
            setStudents(res.data.allstudent || []);
        } catch (error) {
            console.error("Error fetching pending students:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveStudent = async (id) => {
        setApproving((prev) => ({ ...prev, [id]: true }));
        try {
            await axios.put(`${API}/api/student/update-status/${id}`, {
                isApproved: true,
            });
            setStudents((prev) => prev.filter((stu) => stu._id !== id));
        } catch (error) {
            console.error("Approval failed:", error);
            alert("Failed to approve student.");
        } finally {
            setApproving((prev) => ({ ...prev, [id]: false }));
        }
    };

    const deleteStudent = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) return;

        setDeleting((prev) => ({ ...prev, [id]: true }));
        try {
            await axios.delete(`${API}/api/student/delete-student/${id}`);
            setStudents((prev) => prev.filter((stu) => stu._id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete student.");
        } finally {
            setDeleting((prev) => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    if (loading) return <div className="p-6 text-center">Loading pending students...</div>;

    if (students.length === 0) {
        return <div className="p-6 text-center text-gray-500">No pending students found.</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-6">Pending Student Approvals</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                    <div
                        key={student._id}
                        className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition relative"
                    >
                        {/* Delete (X) Button */}
                        <button
                            onClick={() => deleteStudent(student._id)}
                            disabled={deleting[student._id]}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                            title="Delete Student"
                        >
                            {deleting[student._id] ? "⏳" : "✕"}
                        </button>

                        <div>
                            <p><strong>Name:</strong> {student.name}</p>
                            <p><strong>Email:</strong> {student.email}</p>
                            <p><strong>Phone:</strong> {student.phone}</p>
                            <p><strong>Parent Phone:</strong> {student.parentPhone}</p>
                            <p className="text-yellow-600 font-medium mt-2">Status: Pending Approval</p>
                        </div>
                        <button
                            onClick={() => approveStudent(student._id)}
                            disabled={approving[student._id]}
                            className={`mt-4 px-4 py-2 rounded text-white ${approving[student._id]
                                ? "bg-gray-400"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {approving[student._id] ? "Approving..." : "Approve"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingStudents;
