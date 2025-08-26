import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PendingBatch = () => {
    const [pendingBatch, setPendingBatch] = useState([]);
    const { authData } = useAuth();

    const fetchPendingBatch = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URI}/api/batch/pendingbatch/${authData.student.id}`
            );
            setPendingBatch(res.data.batches || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (authData?.student?.id) {
            fetchPendingBatch();
        }
    }, [authData]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Pending Batches</h2>

            {pendingBatch.length === 0 ? (
                <p className="text-center text-gray-500">No pending batches found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pendingBatch.map((val, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-semibold text-yellow-600 mb-2">{val.name}</h3>
                            <p className="text-gray-700 mb-1">
                                <strong>Price:</strong> ₹{val.price}
                            </p>
                            {val?.teacher?.name && (
                                <p className="text-gray-600">
                                    <strong>Teacher:</strong> {val.teacher.name}
                                </p>
                            )}
                            {/* <p className="text-sm text-gray-400 mt-2 truncate">
                                <strong>Batch ID:</strong> {val._id}
                            </p> */}
                            <span className="mt-3 inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                                ⏳ Pending Approval
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingBatch;
