import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username);

        if (!username || !password) {
            setError('Username and password cannot be empty.');
            return;
        }

        if (!user || user.password !== password) {
            setError('Invalid username or password.');
            return;
        }

        // Simulate user login
        localStorage.setItem('currentUser', JSON.stringify(user));
        // If user is logged in, navigate to the password manager page;
        navigate('/password-manager'); // navigate and useNavigate are a couple; useNavigate defined in the PasswordManagerPage
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}