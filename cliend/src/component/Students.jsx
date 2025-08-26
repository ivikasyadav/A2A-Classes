import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Students = () => {
    const [allStudent, setAllStudent] = useState([]);

    const fetchStudent = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/student/approved-student`);
            setAllStudent(res.data.allstudent);
        } catch (e) {
            console.log(e);
        }
    };

    const handleClick = async (id) => {
        if (!window.confirm("Are you sure you want to remove this student?")) return;
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URI}/api/student/update-status/${id}`, { isApproved: false });
            console.log(res.data);
            fetchStudent(); // refresh list after removal
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Approved Students</h1>

            {allStudent.length === 0 ? (
                <p className="text-center text-gray-500">No students found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allStudent.map((student) => (
                        <div
                            key={student._id}
                            className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{student.name}</p>
                                <p className="text-gray-600 break-all mt-1">{student.email}</p>
                            </div>
                            <button
                                onClick={() => handleClick(student._id)}
                                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Students;
