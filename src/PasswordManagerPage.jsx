import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordManagerPage() {
    const navigate = useNavigate(); // navigate accross different pages.
    // Todo: retrieve the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    return (
        <div>
            <h2>Password Manager</h2>
            {/* Password manager content */}
            <p>Welcome, {currentUser.username}!</p>
        </div>
    );
}
