import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth hook
import './Common.css';
import axios from 'axios';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, logout, user } = useAuth(); // Get login function from useAuth hook, can import 1 or 2 or all attributes in the ContextProvider
    const [users, setAllUsers] = useState([]);

    async function getAllUsers() {
        const response = await axios.get('/api/users');
        setAllUsers(response.data);
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // const users = JSON.parse(localStorage.getItem('users')) || [];

        const foundUser = users.find(user => user.username === username); // an user object with username + password if it can be found in the storage

        if (!username || !password) {
            setError('Username and password cannot be empty.');
            return;
        }

        if (!foundUser || foundUser.password !== password) {
            setError('Invalid username or password.');
            return;
        }

        // Simulate user login
        // localStorage.setItem('currentUser', JSON.stringify(user));
        login(foundUser); // set user data as not null via the context provider

        // If user is logged in, navigate to the password manager page;
        navigate('/password-manager'); // navigate and useNavigate are a couple; useNavigate defined in the PasswordManagerPage
    };

    // If user is logged in, render null (nothing)
    if (user) {
        return null;
    }

    // If user is not logged in, render the login form
    return (
        <div className='form-content'>
            <h2>Login</h2>
            {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>

            </form>

        </div >
    );
}