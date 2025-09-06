// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';
import logo1 from '../assets/logo1.jpg';

const Navbar = () => {
    const { authData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // implement this in AuthContext
        navigate('/');
    };

    const navItems = [
        { name: 'Student', path: '/' },
        { name: 'Admin', path: '/admin-login' },
        { name: 'Teacher', path: '/teacher-login' },
    ];

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="text-2xl font-bold">
                    <NavLink to="/" className="hover:text-gray-200">
                        <img src={logo1} alt="" className='h-12'/>
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

export default Navbar;
