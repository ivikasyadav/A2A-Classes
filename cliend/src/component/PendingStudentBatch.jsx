import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PendingStudent = () => {
  const [pendingStudents, setPendingStudents] = useState([]);

  const fetchPendingStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/student/pendingstudent`);
      setPendingStudents(res.data.allstudent);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to approve this student?")) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URI}/api/student/update-status/${id}`, { isApproved: true });
      // Refresh the list
      fetchPendingStudents();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Pending Students</h1>

      {pendingStudents.length === 0 ? (
        <p className="text-center text-gray-500">No pending students.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pendingStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{student.name}</p>
                <p className="text-gray-600 break-all mt-1">{student.email}</p>
                {student.phone && <p className="text-gray-600 mt-1">Phone: {student.phone}</p>}
              </div>
              <button
                onClick={() => handleAccept(student._id)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingStudent;
