import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LectureManager = () => {
    const { authData } = useAuth();
    const [specificLecture, setSpecificLecture] = useState(null);
    const [batchStudents, setBatchStudents] = useState([]);
    const [teacherLectures, setTeacherLectures] = useState([]);
    const [batches, setBatches] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [form, setForm] = useState({
        name: "",
        batchId: "",
        startTime: "",
        endTime: "",
    });

    const [editLectureId, setEditLectureId] = useState(null);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const API = import.meta.env.VITE_API_URI;

    // Fetch teacher batches
    const fetchTeacherBatches = async () => {
        try {
            const res = await axios.get(`${API}/api/batch/mybatch/${authData.teacher.id}`);
            setBatches(res.data.batches || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch teacher lectures
    const fetchLecturesByTeacher = async () => {
        try {
            const res = await axios.get(`${API}/api/lecture/teacher-lecture/${authData.teacher.id}`);
            setTeacherLectures(res.data.lectures || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, teacher: authData.teacher.id };

            if (editLectureId) {
                await axios.put(`${API}/api/lecture/update-lecture/${editLectureId}`, payload);
                setEditLectureId(null);
            } else {
                await axios.post(`${API}/api/lecture/create-lecture/`, payload);
            }

            setForm({ name: "", batchId: "", startTime: "", endTime: "" });
            setAccordionOpen(false);
            fetchLecturesByTeacher();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/api/lecture/delete-lecture/${id}`);
            if (specificLecture?._id === id) {
                setSpecificLecture(null);
                setBatchStudents([]);
                setModalOpen(false);
            }
            fetchLecturesByTeacher();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (lecture) => {
        setForm({
            name: lecture.name,
            batchId: lecture.batch._id || lecture.batch,
            startTime: lecture.startTime.slice(0, 16),
            endTime: lecture.endTime.slice(0, 16),
        });
        setEditLectureId(lecture._id);
        setAccordionOpen(true);
    };

    const handleShowLecture = async (lectureId, batchId) => {
        try {
            const res = await axios.get(`${API}/api/lecture/${lectureId}`, { params: { batchId } });
            setSpecificLecture(res.data.lecture);
            setBatchStudents(res.data.students || []);

            const attRes = await axios.get(`${API}/api/attendence/lecture/${lectureId}`);
            setAttendance(attRes.data.map(a => ({ student: a.student._id, status: a.status })));

            setModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAttendance = async (studentId, status) => {
        try {
            if (!specificLecture) return;
            await axios.post(`${API}/api/attendence/mark`, { lectureId: specificLecture._id, studentId, status });

            setAttendance(prev => {
                const exists = prev.find(a => a.student === studentId);
                if (exists) return prev.map(a => a.student === studentId ? { ...a, status } : a);
                return [...prev, { student: studentId, status }];
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (authData?.teacher?.id) {
            fetchLecturesByTeacher();
            fetchTeacherBatches();
        }
    }, [authData]);

    return (
        <div className={`p-4 ${modalOpen ? "" : ""}`}>
            <h2 className="text-xl font-bold mb-4">Lecture Manager</h2>

            {/* Accordion */}
            <div className="mb-6">
                <button
                    className="w-full bg-gray-200 px-4 py-2 rounded flex justify-between items-center"
                    onClick={() => setAccordionOpen(!accordionOpen)}
                >
                    <span>{editLectureId ? "Edit Lecture" : "Add Lecture"}</span>
                    <span>{accordionOpen ? "-" : "+"}</span>
                </button>

                {accordionOpen && (
                    <form onSubmit={handleSubmit} className="mt-2 space-y-2 bg-white p-4 rounded shadow">
                        <input
                            type="text"
                            placeholder="Lecture Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="border p-2 w-full rounded"
                            required
                        />
                        <select
                            value={form.batchId}
                            onChange={e => setForm({ ...form, batchId: e.target.value })}
                            className="border p-2 w-full rounded"
                            required
                        >
                            <option value="">Select Batch</option>
                            {batches.map(batch => <option key={batch._id} value={batch._id}>{batch.name}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={form.startTime}
                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                className="border p-2 w-1/2 rounded"
                                required
                            />
                            <input
                                type="datetime-local"
                                value={form.endTime}
                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                className="border p-2 w-1/2 rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
                            {editLectureId ? "Update Lecture" : "Create Lecture"}
                        </button>
                    </form>
                )}
            </div>

            {/* Lecture List */}
            <h3 className="text-lg font-semibold mb-2">My Lectures</h3>
            {teacherLectures.length === 0 ? (
                <p>No lectures found.</p>
            ) : (
                <ul>
                    {teacherLectures.map(lec => (
                        <li key={lec._id} className="border p-3 mb-2 rounded shadow flex justify-between items-center">
                            <div>
                                <p><strong>{lec.name}</strong></p>
                                <p>Batch: {lec.batch?.name || lec.batch}</p>
                                <p>Start: {new Date(lec.startTime).toLocaleString()}</p>
                                <p>End: {new Date(lec.endTime).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShowLecture(lec._id, lec.batch._id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleEdit(lec)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(lec._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal */}
            {modalOpen && specificLecture && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded p-6 w-11/12 md:w-2/3 max-h-[90vh] overflow-auto relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-2 bg-gray-300 px-2 py-1 rounded"
                        >
                            X
                        </button>
                        <h4 className="text-lg font-semibold mb-2">Lecture Details</h4>
                        <p><strong>Name:</strong> {specificLecture.name}</p>
                        <p><strong>Batch:</strong> {specificLecture.batch?.name}</p>
                        <p><strong>Start:</strong> {new Date(specificLecture.startTime).toLocaleString()}</p>
                        <p><strong>End:</strong> {new Date(specificLecture.endTime).toLocaleString()}</p>

                        <h5 className="mt-4 font-semibold">Students:</h5>
                        {batchStudents.length === 0 ? (
                            <p>No students in this batch.</p>
                        ) : (
                            <ul className="space-y-2">
                                {batchStudents.map(stu => {
                                    const att = attendance.find(a => a.student === stu._id)?.status || "N.A";
                                    return (
                                        <li key={stu._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <span>{stu.name} ({stu.email})</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="font-bold">{att === "Present" ? "P" : att === "Absent" ? "A" : "N.A"}</span>
                                                <button
                                                    onClick={() => handleMarkAttendance(stu._id, "Present")}
                                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(stu._id, "Absent")}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Absent
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureManager;
