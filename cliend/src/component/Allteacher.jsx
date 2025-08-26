import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Allteacher = () => {
    const { authData } = useAuth();
    const [teacherData, setTeacherData] = useState([]);
    const navigate = useNavigate();

    const fetchTeacherData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/teacher/allteacher`);
            setTeacherData(res.data.data);
            console.log(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URI}/api/teacher/deleteTeacher/${id}`);
            console.log(res.data);
            fetchTeacherData();
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect(() => {
    //     if (!authData?.admin) {
    //         navigate('/');
    //     }
    // }, [authData]);

    useEffect(() => {
        fetchTeacherData();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">All Teachers</h1>

            {teacherData.length === 0 ? (
                <p className="text-center text-gray-500">No teachers found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {teacherData.map((teacher) => (
                        <div
                            key={teacher._id}
                            className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{teacher.name}</p>
                                <p className="text-gray-600 mt-1 break-all">{teacher.email}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(teacher._id)}
                                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Allteacher;
