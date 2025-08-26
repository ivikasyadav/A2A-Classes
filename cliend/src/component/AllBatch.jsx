import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AllBatch = () => {
    const [batchData, setBatchData] = useState([]);
    const { authData } = useAuth();

    const fetchBatchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/batch/notbtach/${authData.student.id}`);
            setBatchData(res.data.batches);
        } catch (error) {
            console.log(error);
        }
    };

    const handleApply = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URI}/api/student/apply-batch/${authData.student.id}`, {
                batchId: id._id,
            });
            fetchBatchData();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (authData) {
            fetchBatchData();
        }
    }, [authData]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Batches</h2>

            {batchData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batchData.map((val, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105"
                        >
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">{val.name}</h3>
                            <p className="text-gray-600 mb-4">
                                <strong>Price:</strong> ₹{val.price}
                            </p>
                            <button
                                onClick={() => handleApply(val)}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No batches available.</p>
            )}
        </div>
    );
};

export default AllBatch;
