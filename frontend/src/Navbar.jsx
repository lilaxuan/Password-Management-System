import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Navbar.css';
import { BrowserRouter as Router, Link, Routes, Route, useNavigate } from 'react-router-dom';

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
        }, 900);
        navigate('/');

    }

    // function handleProfileSetup() {
    //     navigate('/profile-setup');
    // }

    const handleDropdownChange = (event) => {
        navigate(event.target.value);
    };

    return (
        <div>
            <nav className="navbar">
                {user ? (
                    // when user is logged in (not null)
                    <>
                        <Link to="/" >Home</Link>
                        <button className='logout-button' onClick={handleLogout}>Logout</button>
                        {/* <span className="user-info" onClick={handleProfileSetup}>{user.username}</span> */}
                        <span className="user-info">
                            <select onChange={handleDropdownChange} defaultValue="">
                                <option value="" disabled>{user.username}</option>
                                <option value="/password-manager">Password Manager</option>
                                <option value="/profile-setup">Profile Setting</option>
                            </select>
                        </span>
                    </>

                ) : (
                    // when user is not logged in (null)
                    <>
                        <Link to="/" >Home</Link>
                        <Link to="/register" >Register</Link>
                        <Link to="/login" className="login-link">Login</Link>
                    </>
                )}

            </nav>

            {/* if the logged out message is not null, display the log out messgae */}
            {
                logoutMessage && (
                    <div className="logout-message">
                        {logoutMessage}
                    </div>
                )
            }
        </div >
    );
};