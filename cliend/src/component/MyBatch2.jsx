import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const MyBatch2 = () => {
    const [myBatch, setMyBatch] = useState([]);
    const { authData } = useAuth();

    const fetchBatch = async () => {
        // if (!authData.teacher.id) return;

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URI}/api/batch/mybatch/${authData.student.id}`
            );
            setMyBatch(res.data.batches || []);
            console.log(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (authData?.student?.id) {
            fetchBatch(); 
        }
    }, [authData]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Batches</h2>
            {myBatch.length === 0 && <p>No batches found.</p>}

            <div>
                {myBatch.map((val, idx) => (
                    <div key={idx} className="border p-2 mb-2 rounded">
                        <p>
                            <strong>Name:</strong> {val.name}
                        </p>
                        <p>
                            <strong>Price:</strong> ${val.price}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBatch2;
