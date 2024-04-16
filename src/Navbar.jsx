import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Navbar.css';
import { BrowserRouter as Router, Link, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePageContent from './HomePageContent';
import PasswordManagerPage from './PasswordManagerPage';

export default function Navbar() {
    const { user, logout } = useAuth();
    // const navigate = useNavigate(); // Only children of Router can use useNavigate(), cannot be used here if Router is included in the return section
    console.log('current user: ', user);  // on object: {username: 'xianer', password: '123456'}
    const navigate = useNavigate();
    const [logoutMessage, setLogoutMessage] = useState('');

    function handleLogout() {
        logout(); // set the user data as empty
        setLogoutMessage('Logged out successfully.');
        setTimeout(() => {
            setLogoutMessage('');
        }, 900); // Hide message after 3 seconds
        navigate('/');

    }

    return (
        <div>
            <nav className="navbar">
                {user ? (
                    // when user is logged in (not null)
                    <>
                        <Link to="/" >Home</Link>
                        <button onClick={handleLogout}>Logout</button>
                        <span className="user-info">{user.username}</span>

                    </>

                ) : (
                    // when user is not logged in (null)
                    <>
                        <Link to="/" >Home</Link>
                        <Link to="/register" >Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}

            </nav>

            {/* if the logged out message is not null, display the log out messgae */}
            {logoutMessage && (
                <div className="logout-message">
                    {logoutMessage}
                </div>
            )}
        </div>

        // <Router>
        //     <div>
        //         <nav className="navbar">
        //             <Link to="/" >Home</Link>
        //             <Link to="/register" >Register</Link>
        //             <Link to="/login">Login</Link>

        //             {/* based on if user is logged in, differentiate the Navbar */}
        //             {/* {user ? (
        //                 // when user is logged in
        //                 <>
        //                     <button onClick={handleLogout}>Logout</button>
        //                     <span className="user-info">{user.username}</span>
        //                 </>
        //             ) : (
        //                 // when user is logged in
        //                 <>
        //                     <Link to="/register">Register</Link>
        //                     <Link to="/login">Login</Link>
        //                 </>
        //             )} */}
        //         </nav>

        //         {/* Routes Definitions */}
        //         <Routes>
        //             <Route path="/" element={<HomePageContent />} />
        //             <Route path="/register" element={<RegisterPage />} />
        //             <Route path="/login" element={<LoginPage />} />
        //             <Route path="/password-manager" element={<PasswordManagerPage />} />
        //         </Routes>
        //     </div>
        // </Router>
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


