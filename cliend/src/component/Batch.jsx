import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TeacherBatch from './TeacherBatch';

const Batch = () => {
    const [batchData, setBatchData] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [showPendingStudents, setShowPendingStudents] = useState(false);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [addBatch, setAddBatch] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const API = import.meta.env.VITE_API_URI;

    const fetchBatchData = async () => {
        try {
            const res = await axios.get(`${API}/api/batch/allbatch`);
            setBatchData(res.data.allBatch);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddBatch = async () => {
        try {
            if (!name || !price) return alert("Please fill all fields");
            await axios.post(`${API}/api/batch/createBatch`, { name, price });
            setAddBatch(false);
            setName("");
            setPrice("");
            fetchBatchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteBatch = async (batchId) => {
        const confirmDelete = confirm("Are you sure you want to delete this batch?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API}/api/batch/deleteBatch/${batchId}`);
            fetchBatchData();
        } catch (error) {
            console.error("Error deleting batch:", error);
        }
    };

    const openModal = (batch) => {
        setSelectedBatch(batch);
        setShowPendingStudents(false);
    };

    const closeModal = () => {
        setSelectedBatch(null);
        setShowPendingStudents(false);
        setPendingStudents([]);
    };

    const handlePendingStudents = async (batch) => {
        try {
            const res = await axios.get(`${API}/api/batch/pending-students/${batch._id}`);
            setPendingStudents(res.data.students || []);
            setSelectedBatch(batch);
            setShowPendingStudents(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async (studentId) => {
        try {
            await axios.put(`${API}/api/student/update-batch/${studentId}`, {
                batchId: selectedBatch._id,
                status: true
            });
            setPendingStudents(prev => prev.filter(stu => stu._id !== studentId));
            fetchBatchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (studentId) => {
        try {
            await axios.put(`${API}/api/student/update-batch/${studentId}`, {
                batchId: selectedBatch._id,
                status: false
            });
            setPendingStudents(prev => prev.filter(stu => stu._id !== studentId));
            fetchBatchData();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBatchData();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
                <h2 className="text-2xl font-bold mb-4 md:mb-0">All Batches</h2>
                <button
                    onClick={() => setAddBatch(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                    Add Batch
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {batchData.map((batch) => (
                    <div
                        key={batch._id}
                        className="relative bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                    >
                        <button
                            onClick={() => handleDeleteBatch(batch._id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                            title="Delete Batch"
                        >
                            &times;
                        </button>

                        <div>
                            <p className="font-semibold text-gray-800 text-lg">{batch.name}</p>
                            <p className="text-gray-600 mt-1">Price: ₹{batch.price}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => openModal(batch)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => handlePendingStudents(batch)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                            >
                                Pending Students
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Batch Modal */}
            {selectedBatch && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        {showPendingStudents ? (
                            <>
                                <h2 className="text-xl font-bold mb-4">Pending Students</h2>
                                {pendingStudents.length === 0 ? (
                                    <p className="text-gray-500">No pending students.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {pendingStudents.map((stu) => (
                                            <li key={stu._id} className="border p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div>
                                                    <p><strong>Name:</strong> {stu.name}</p>
                                                    <p><strong>Email:</strong> {stu.email}</p>
                                                    <p><strong>Phone:</strong> {stu.phone}</p>
                                                </div>
                                                <div className="flex gap-2 mt-2 sm:mt-0">
                                                    <button
                                                        onClick={() => handleAccept(stu._id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(stu._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <TeacherBatch batch={selectedBatch} />
                        )}
                    </div>
                </div>
            )}

            {/* Add Batch Modal */}
            {addBatch && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={() => setAddBatch(false)}
                            className="absolute top-2 right-2 text-red-500 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <h1 className="text-xl font-bold mb-4">Add Batch</h1>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Batch Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 rounded focus:outline-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border p-2 rounded focus:outline-blue-500"
                            />
                            <button
                                onClick={handleAddBatch}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                            >
                                Add Batch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Batch;
