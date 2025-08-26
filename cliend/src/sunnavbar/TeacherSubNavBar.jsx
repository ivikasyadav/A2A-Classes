// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeacherSubNavBar = () => {
    const { authData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // implement this in AuthContext
        navigate('/');
    };

    const navItems = [
        // { name: 'Student', path: '/' },
        // { name: 'Admin', path: '/admin-login' },
        //  { name: 'Teacher', path: '/teacher-login' },
        // { name: 'All Teacher', path: '/student' },
        // { name: 'All Batch', path: '/student/allbatch' },
        // { name: 'My Batch', path: '/student/mybatch' },
        // { name: 'Pending Batch', path: '/student/pending' },
        // { name: 'Attendence', path: '/student/attendence' },
        // { name: 'All Batch', path: '/teacher' },
        { name: 'My Batch', path: '/teacher/my-batch' },
        { name: 'My lecture', path: '/teacher/my-lecture' },
        { name: 'All lecture', path: '/teacher/all-lecture' },
    ];

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="text-2xl font-bold">
                    <NavLink to="/" className="hover:text-gray-200">
                        Class Manager
                    </NavLink>
                </div>

                <div className="space-x-4 hidden sm:flex items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded hover:bg-blue-700 ${isActive ? 'bg-blue-800' : ''
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}

                    {/* Login / Logout Button */}
                    {authData ? (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded hover:bg-blue-700 bg-red-500"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded hover:bg-blue-700 ${isActive ? 'bg-blue-800' : ''
                                }`
                            }
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TeacherSubNavBar;
