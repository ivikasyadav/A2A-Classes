import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const MyBatch = () => {
    const [myBatch, setMyBatch] = useState([]);
    const { authData } = useAuth();

    const fetchBatch = async () => {
        if (!authData?.teacher?.id) return;

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URI}/api/batch/mybatch/${authData.teacher.id}`
            );
            setMyBatch(res.data.batches || []);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (authData?.teacher?.id) {
            fetchBatch();
        }
    }, [authData]);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">My Batches</h2>

            {myBatch.length === 0 ? (
                <p className="text-center text-gray-500">No batches found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myBatch.map((batch) => (
                        <div
                            key={batch._id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
                        >
                            <p className="text-lg font-semibold text-gray-800">{batch.name}</p>
                            <p className="text-gray-600 mt-2">Price: ₹{batch.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBatch;
