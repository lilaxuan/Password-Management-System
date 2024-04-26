import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Common.css';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [users, setAllUsers] = useState([]);

    async function getAllUsers() {
        const response = await axios.get('/api/users');
        console.log('hihi-getAllUsers: ', response);
        setAllUsers(response.data);
    }

    useEffect(() => {
        getAllUsers();
    }, []);


    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!username || !firstname || !lastname || !email || !phone || !password || !confirmPassword) {
            setError('The information cannot be empty.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if the new user exists in the database or not
        const userExists = users.find(user => user.username === username);
        if (userExists) {
            setError('Username already exists.');
            return;
        }

        const newUser = { username, firstname, lastname, email, phone, password };
        // Insert the new user to the database
        await axios.post('/api/users', newUser); // newUser will be passed in the reuqest body
        navigate('/login');
        // navigate('/password-manager');
    };

    return (
        <div className='form-content '>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Firstname: </label>
                    <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Lastname: </label>
                    <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Email: </label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Phone: </label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Confirm Password: </label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}