import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './PasswordManagerPage.css';


export default function PasswordManagerPage() {
    const navigate = useNavigate(); // navigate accross different pages.
    // Todo: retrieve the current user
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const { user, login } = useAuth();
    const [url, setUrl] = useState('');
    const [password, setPassword] = useState([]);
    const [passowrdsList, setPasswordsList] = useState([]); // the elements to be rendered on the page
    const [editingState, setEditingState] = useState(false);
    const [passwordId, setPasswordId] = useState('');

    if (!user) {
        console.log('user is none ------');
        navigate('/login');
        return null;
    }

    async function getAllPasswordsRecords() {
        console.log('in getAllPasswordsRecords')
        if (!user) {
            console.log('getAllPasswordsRecords cannot be completed since user is null');
            navigate('/login');
            return null;
        }

        console.log('current user - getAllPasswordsRecords: ', user);
        const userId = user._id;
        console.log('userid - getAllPasswordsRecords: ', userId);

        const response = await axios.get(`/api/passwords/users/${userId}`);
        // avoid cache!!
        // const response = await axios.get(`/api/passwords/users/${userId}`, {
        //     headers: {
        //         'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevents caching of the response
        //         'Pragma': 'no-cache', // HTTP 1.0 backward compatibility
        //         'Expires': '0' // Proxies
        //     }
        // });


        console.log('allPasswordsRecords is - getAllPasswordsRecords: ', response);
        const allPasswordsRecords = response.data;

        // Password records elements
        const passwordsListElement = [];
        for (let i = 0; i < allPasswordsRecords.length; i++) {
            // let newObj = {
            //     url: allPasswordsRecords[i].url,
            //     password: allPasswordsRecords[i].password
            // };
            // passwordsListElement.push(newObj);
            passwordsListElement.push(
                <div className='password-list'>
                    <div className='flex-item-container'>
                        <p> {i + 1}. </p>
                        <label> {allPasswordsRecords[i].url} </label>
                        <label>  {allPasswordsRecords[i].password} </label>
                        <button onClick={() => editPasswordRecord(allPasswordsRecords[i]._id, allPasswordsRecords[i].url, allPasswordsRecords[i].password)}> Edit </button>
                        <button onClick={() => deletePasswordRecord(allPasswordsRecords[i]._id)}> Delete </button>
                    </div>
                </div>);
        }
        console.log('passwordsListElement: ', passwordsListElement);
        setPasswordsList(passwordsListElement);
    }

    useEffect(() => {
        getAllPasswordsRecords();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault(); // prevent page reloading to reset user to be null; 

        const userId = user._id;
        const username = user.username;
        const newPasswordRecord = { userId, url, username, password }; // does the order matters??? 
        console.log('the new added password record is: ', newPasswordRecord);

        // based on editing state, determine whether it's update or create new
        if (editingState === true) {
            await axios.put(`/api/passwords/${passwordId}`, newPasswordRecord);

            // setEditingState(false);
            // setPassword('')
            // setUrl('');
        } else {
            await axios.post('/api/passwords', newPasswordRecord);
        }

        onCancel(); // set back to initial state

        console.log('hihi-current user is: ', user);
        getAllPasswordsRecords(); // When last password record of the users's deleted, it will throw error due to the api check the passwords length
    }

    function onCancel() {
        setEditingState(false);
        setUrl('');
        setPassword('');

    }

    // Set editing state, but sbumission depends on the submit changes button!! 
    async function editPasswordRecord(passwordRecordId, newUrl, newPassword) {
        // updates the item in the form
        setEditingState(true);
        setUrl(newUrl);
        setPassword(newPassword);
        setPasswordId(passwordRecordId);

        // const userId = user._id;
        // const username = user.username;
        // const newPasswordRecord = { userId, newUrl, username, newPassword };
        // await axios.put(`/api/passwords/${passwordRecordId}`, newPasswordRecord);
        // console.log('finish updating!!');

    }

    async function deletePasswordRecord(passwordRecordId) {
        console.log('id is: ', passwordRecordId);
        console.log('start deleteing');
        await axios.delete(`/api/passwords/${passwordRecordId}`);  // await axios.delete('/api/passwords/' + passwordRecordId);
        console.log('The password record has been deleted successfully!');
        // setDeletedState(true);
        // setTimeout(() => {
        //     getAllPasswordsRecords();
        // }, 1000); // Hide message after 1 second
        await getAllPasswordsRecords(); // cache exists so that we have to refresh the page to get the updated records!!!
        // console.log('finish re-retriving all passwords');
    }



    return (
        <div className='password-manager-page' >
            <div className='title'>
                <h2>Password Manager Page</h2>
                <p>Welcome, {user.username}!</p>
            </div>
            <div className='passwords-list'>
                {passowrdsList && passowrdsList.length > 0 ? (
                    passowrdsList
                ) : (
                    <p>No passwords for this user</p>
                )}            </div>
            <form className="flex-item-container" onSubmit={handleSubmit}>
                {/* <div className='flex-item-container'> */}
                <div>
                    <label>URL:</label>
                    <input type="text" id="autoWidthInput" value={url} onChange={e => setUrl(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="text" id="autoWidthInput" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                {/* </div> */}
                <button type="submit"> {editingState ? "Submit changes" : "Create new"} </button>
                <button onClick={onCancel}> Cancel </button>
            </form>


        </div>
    );
}
