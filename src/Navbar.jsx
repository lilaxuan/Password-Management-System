import React from 'react';
import { useAuth } from './AuthContext';
import './Navbar.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export default function Navbar() {
    return (
        <nav className="navbar">
            <a href="/">Home</a>
            <a href="/register"> Register  </a>
            <a href="/login"> Login  </a>
        </nav>
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


