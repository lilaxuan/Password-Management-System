import React from 'react';
import { useAuth } from './AuthContext';
import './Navbar.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import PasswordManagerPage from './PasswordManagerPage';

export default function Navbar() {
    return (
        <Router>
            <div>
                <nav className="navbar">
                    <Link to="/" >Home</Link>
                    <Link to="/register" >Register</Link>
                    <Link to="/login">Login</Link>
                </nav>

                {/* Routes Definitions */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/password-manager" element={<PasswordManagerPage />} />
                </Routes>
            </div>
        </Router>
    );
};



// export default function Navbar() {
//     const { user, logout } = useAuth();

//     return (
//         <nav>
//             <a href="/">Home</a>
//             {user ? (
//                 <>
//                     <button onClick={logout}>Log Out</button>
//                     <span style={{ fontStyle: 'italic', marginLeft: '10px' }}>{user.username}</span>
//                 </>
//             ) : (
//                 <a href="/login">Login/Register</a>
//             )}
//         </nav>
//     );
// };


