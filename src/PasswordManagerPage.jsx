import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './PasswordManagerPage.css';

export default function PasswordManagerPage() {
    const navigate = useNavigate(); // navigate accross different pages.
    // Todo: retrieve the current user
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const { user } = useAuth();

    const [url, setUrl] = useState('');
    const [password, setPassword] = useState([]);
    const [passowrdsList, setPasswordsList] = useState([]); // the elements to be rendered on the page

    if (!user) {
        navigate('/login');
        return null;
    }

    async function getAllPasswordsRecords() {
        const userId = user._id;
        const response = await axios.get(`/api/passwords/users/${userId}`);
        console.log('allPasswordsRecords is : ', response);
        const allPasswordsRecords = response.data;
        const passwordsListElement = [];
        for (let i = 0; i < allPasswordsRecords.length; i++) {
            // let newObj = {
            //     url: allPasswordsRecords[i].url,
            //     password: allPasswordsRecords[i].password
            // };
            // passwordsListElement.push(newObj);
            passwordsListElement.push(
                <div className='passwords-list'>
                    <li>
                        url: {allPasswordsRecords[i].url} -
                        password: {allPasswordsRecords[i].password} -
                        <button> Edit </button> -
                        <button> Delete </button>
                    </li>
                </div>);
        }
        console.log('passwordsListElement: ', passwordsListElement);
        setPasswordsList(passwordsListElement);
    }

    useEffect(() => {
        getAllPasswordsRecords();
    }, []);

    async function handleSubmit() {
        const userId = user._id;
        const username = user.username;
        const newPasswordRecord = { userId, url, username, password }; // does the order matters??? 
        console.log('the new added password record is: ', newPasswordRecord);
        await axios.post('/api/passwords', newPasswordRecord);
        getAllPasswordsRecords();
    }



    return (
        <div className='password-manager-page' >
            <div className='title'>
                <h2>Password Manager Page</h2>
                <p>Welcome, {user.username}!</p>
            </div>
            <div>
                {passowrdsList}
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>URL:</label>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit">Save Password</button>
            </form>


        </div>
    );
}
