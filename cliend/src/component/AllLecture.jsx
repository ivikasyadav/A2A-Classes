import React, { useEffect, useState } from "react";
import axios from "axios";

const AllLecture = () => {
    const [allLectures, setAllLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState(null);

    const fetchLecture = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/lecture/all-lecture`);
            setAllLectures(res.data.lectures || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLecture();
    }, []);

    const openModal = (lecture) => setSelectedLecture(lecture);
    const closeModal = () => setSelectedLecture(null);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center sm:text-left">All Lectures</h2>

            {allLectures.length === 0 ? (
                <p className="text-center">No lectures found.</p>
            ) : (
                <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {allLectures.map((lec, idx) => (
                        <li
                            key={idx}
                            className="border p-3 rounded shadow hover:bg-gray-50 flex flex-col justify-between"
                        >
                            <div className="mb-2">
                                <p className="text-sm sm:text-base"><strong>Name:</strong> {lec.name}</p>
                                <p className="text-sm sm:text-base"><strong>Teacher:</strong> {lec.teacher?.name || "N/A"}</p>
                            </div>
                            <button
                                onClick={() => openModal(lec)}
                                className="bg-blue-500 text-white px-3 py-1 rounded self-start hover:bg-blue-600"
                            >
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal */}
            {selectedLecture && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-black/30 z-50 p-2">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl relative overflow-auto max-h-[90vh]">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-red-500 text-xl"
                        >
                            &times;
                        </button>

                        <h3 className="text-lg font-bold mb-3">{selectedLecture.name}</h3>
                        <p><strong>Teacher:</strong> {selectedLecture.teacher?.name}</p>
                        <p><strong>Start:</strong> {new Date(selectedLecture.startTime).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(selectedLecture.endTime).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllLecture;
