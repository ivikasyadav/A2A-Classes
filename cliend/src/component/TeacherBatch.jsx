import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TeacherBatch = ({ batch }) => {
     const [teacherData,setTeacherData]=useState([])
    const [selectedTeacherId, setSelectedTeacherId] = useState("");
    
        const fetchTeacherData=async()=>{
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/teacher/allteacher`)
                setTeacherData(res.data.data)
                // console.log(res.data.data)
            } catch (error) {
                console.log(error)
            }
        }

        useEffect(()=>{
            fetchTeacherData()
        },[])

    const handleAssignTeacher = async () => {
        console.log("hi")
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URI}/api/batch/assign-teacher`, {
                batchId: batch._id,
                teacherId: selectedTeacherId,
            });
            console.log(res)
            alert("Teacher assigned successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to assign teacher");
        }
    };
    
    return (
        <div>
            <h3 className="text-lg font-bold mb-2">Batch Details</h3>
            <p><strong>ID:</strong> {batch._id}</p>
            <p><strong>Name:</strong> {batch.name}</p>
            <p><strong>Price:</strong> ₹{batch.price}</p>

            <select
                className="border p-2 rounded w-full max-w-md"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
                <option value="">-- Select a teacher --</option>
                {teacherData.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                        {teacher.name} ({teacher.email})
                    </option>
                ))}
            </select>
            <button
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAssignTeacher}
                disabled={!selectedTeacherId}
            >
                Assign
            </button>

            {/* Display Teachers */}
            <div className="mt-4">
                <h4 className="font-semibold">Teachers:</h4>
                {batch.teachers && batch.teachers.length > 0 ? (
                    <ul className="list-disc ml-5">
                        {batch.teachers.map((teacher, idx) => (
                            <li key={idx}>
                
                               {teacher}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No teachers assigned</p>
                )}
            </div>

            {/* Display Students */}
            <div className="mt-4">
                <h4 className="font-semibold">Students:</h4>
                {batch.students && batch.students.length > 0 ? (
                    <ul className="list-disc ml-5">
                        {batch.students.map((student, idx) => (
                            <li key={idx}>
                                {student.name} ({student.email})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No students enrolled</p>
                )}
            </div>
        </div>
    );
};

export default TeacherBatch;
