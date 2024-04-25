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
    const [passwordsListElement, setPasswordsListElement] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const [editingState, setEditingState] = useState(false);
    const [passwordId, setPasswordId] = useState('');
    const [error, setError] = useState('');
    const [useAlphabet, setUseAlphabet] = useState(false);
    const [useNumerals, setUseNumerals] = useState(false);
    const [useSymbols, setUseSymbols] = useState(false);
    const [passwordLength, setPasswordLength] = useState(8);
    const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
    const [initialVisibilityState, setInitialVisibilityState] = useState({});
    const [selectedSharePasswordIds, setShareSelectedPasswordIds] = useState([]);
    const [shareUsername, setShareUsername] = useState('');
    const [shareError, setShareError] = useState('');


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
            console.log('current - initialVisibilityState: ', initialVisibilityState);
            passwordsListElement.push(
                <div className='password-list'>
                    <div className='flex-item-container'>
                        <p> {i + 1}. </p>
                        <label> {allPasswordsRecords[i].url} </label>
                        {/* <label>  {allPasswordsRecords[i].password} </label> */}
                        <label htmlFor={`passwordInput${allPasswordsRecords[i]._id}`}>
                            {initialVisibilityState[allPasswordsRecords[i]._id] ? allPasswordsRecords[i].password : '*******'}
                        </label>
                        <button onClick={() => togglePasswordVisibility(allPasswordsRecords[i]._id, initialVisibilityState)}>
                            {initialVisibilityState[allPasswordsRecords[i]._id] ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => copyToClipboard(allPasswordsRecords[i].password)}>
                            Copy Password
                        </button>

                        <button onClick={() => editPasswordRecord(allPasswordsRecords[i]._id, allPasswordsRecords[i].url, allPasswordsRecords[i].password)}> Edit </button>
                        <button onClick={() => deletePasswordRecord(allPasswordsRecords[i]._id)}> Delete </button>
                        <p> Last used: </p>
                        <p>{formatDate(allPasswordsRecords[i].updatedAt)}</p>
                    </div>
                </div >);
        }
        console.log('passwordsListElement: ', passwordsListElement);
        console.log('password show visiblity: ', initialVisibilityState);
        setPasswordsList(allPasswordsRecords);
        setPasswordsListElement(passwordsListElement);
    }

    // async function getAllUsers() {
    //     const allUsersObject = await axios.get('/api/users');
    //     const allUsersList = []
    //     for (let i = 0; i < allUsersObject.length; i++) {
    //         allUsersList.push(allUsersObject[i].username);
    //     }
    //     setAllUsers(allUsersList);
    // }

    function onStart() {
        getAllPasswordsRecords();
        // getAllUsers();
    }

    useEffect(() => {
        onStart();
    }, []);



    async function handleSubmit(event) {
        event.preventDefault(); // prevent page reloading to reset user to be null; 
        setError('');

        if (!url) {
            setError('Url cannot be empty!');
        }

        if (isGenerateEnabled) {
            if (passwordLength < 4 || passwordLength > 50) {
                setError('Length must be between 4 and 50!');
                return;
            }
        }
        // if (!isValidPassword(password)) {
        //     console.log('invalid password!');
        //     setError('Password length must be greater than 8, and include letters, numbers, special characters like !@#$%^&*./!');
        //     return;
        // }

        const userId = user._id;
        const username = user.username;
        const newPasswordRecord = { userId, url, username, password }; // does the order matters??? 
        console.log('the new added password record is: ', newPasswordRecord);

        // based on editing state, determine whether to update or create new password records
        try {
            if (editingState === true) {
                await axios.put(`/api/passwords/${passwordId}`, newPasswordRecord);
            } else {
                await axios.post('/api/passwords', newPasswordRecord);
            }
        } catch (error) {
            // Check if the error response has a status code of 409
            console.log('error catched!!!');
            if (error.response && error.response.status === 409) {
                console.log('hihihihi');
                setError('Error: Entry with this userId and URL already exists.');
                console.log('error is: ', error);
                console.error('Error: Entry with this userId and URL already exists.', error.response.data);
            } else {
                // Handle other kinds of errors
                setError('An unexpected error occurred:', error.response ? error.response.data : error);
                console.error('An unexpected error occurred:', error.response ? error.response.data : error);
            }
        }

        // set back to initial state but not clear error
        setEditingState(false);
        setUrl('');
        setPassword('');

        console.log('hihi-current user is: ', user);
        getAllPasswordsRecords(); // When last password record of the users's deleted, it will throw error due to the api check the passwords length
    }

    function onCancel() {
        setEditingState(false);
        setUrl('');
        setPassword('');
        setError('');
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
        await getAllPasswordsRecords(); // cache exists so that we have to refresh the page to get the updated records!!!
        onCancel(); // clears input boxes
    }

    function isValidPassword(password) {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*./]/.test(password);
        return hasLetter && hasNumber && hasSpecialChar && password.length >= 8;
    }

    // Autogenerate password
    // function generatePassword() {
    //     const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    //     const numbers = '0123456789';
    //     const specialChars = '!@#$%^&*./';

    //     // Create a random password that meets the requirements
    //     const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    //     const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    //     const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];

    //     // Mix them and create a longer password
    //     const base = randomLetter + randomNumber + randomSpecial;
    //     let newPassword = base;

    //     // Shuffle the base to make it less predictable
    //     newPassword += shuffle(base + letters + numbers + specialChars);

    //     // Set the first 12 characters as the password
    //     setPassword(newPassword.substring(0, 12));
    // }

    // // Shuffle the characters in the password
    // function shuffle(string) {
    //     let parts = string.split('');
    //     for (let i = parts.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [parts[i], parts[j]] = [parts[j], parts[i]];
    //     }
    //     return parts.join('');
    // }


    useEffect(() => {
        updateGenerateButtonState();
    }, [useAlphabet, useNumerals, useSymbols]);

    function updateGenerateButtonState() {
        setIsGenerateEnabled(useAlphabet || useNumerals || useSymbols);
    }

    function generatePassword() {
        if (!isGenerateEnabled) {
            alert("Please select at least one character type (Alphabet, Numerals, or Symbols).");
            return;
        }

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numerals = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:",.<>/?';
        let validChars = '';

        if (useAlphabet) {
            validChars += alphabet;
        }
        if (useNumerals) {
            validChars += numerals;
        }
        if (useSymbols) {
            validChars += symbols;
        }

        let newPassword = '';
        for (let i = 0; i < passwordLength; i++) {
            newPassword += validChars.charAt(Math.floor(Math.random() * validChars.length));
        }

        setPassword(newPassword);
    }

    function daysAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const differenceInTime = now.getTime() - date.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, pad with leading zero
        const day = date.getDate().toString().padStart(2, '0'); // Pad with leading zero

        return `${year}-${month}-${day}`;
    }

    function togglePasswordVisibility(id, initialVisibilityState) {
        console.log('toggle clicked!');
        const pre = initialVisibilityState[id];
        initialVisibilityState[id] = !pre;
        console.log('updated initialVisibilityState: ', initialVisibilityState);
        setInitialVisibilityState(initialVisibilityState);
        getAllPasswordsRecords();
        // setInitialVisibilityState(prevState => ({
        //     ...prevState,
        //     [id]: !prevState[id] // Toggle the visibility state for the specific ID
        // }));
    };


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Password copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    async function handleShareSubmit(event) {
        event.preventDefault();
        if (shareUsername === user.username) {
            setShareError("Cannot share passwords with yourself.");
            return;
        }

        try {
            const response = await axios.post('/api/passwords/share', {
                ownerId: user._id,
                recipientUsername: shareUsername
            });
            if (response.status === 200) {
                alert('Share request sent.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShareError('Username does not exist.');
            } else {
                setShareError('An error occurred while sending the share request.');
            }
        }
    };

    return (
        <div className='password-manager-page' >
            <div className='title'>
                <h2>Password Manager Page</h2>
                <p>Welcome, {user.username}!</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <form className="flex-item-container" onSubmit={handleSubmit}>
                <div>
                    <label>URL:</label>
                    <input type="text" id="autoWidthInput" value={url} onChange={e => setUrl(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="text" id="autoWidthInput" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='flex-item-container'>
                    <label>
                        <input type="checkbox" checked={useAlphabet} onChange={e => setUseAlphabet(e.target.checked)} />
                        Alphabet
                    </label>
                    <label>
                        <input type="checkbox" checked={useNumerals} onChange={e => setUseNumerals(e.target.checked)} />
                        Numerals
                    </label>
                    <label>
                        <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} />
                        Symbols
                    </label>
                    <label>
                        Length:
                        {/* <input type="text" value={passwordLength} onChange={handleLengthChange} /> */}
                        <input type="number" value={passwordLength} onChange={e => setPasswordLength(e.target.value)} />
                    </label>
                </div>
                <button type="button" onClick={generatePassword}>Generate Password</button>
                <button type="submit"> {editingState ? "Submit changes" : "Create new"} </button>
                <button onClick={onCancel}> Cancel </button>
            </form>

            <div className='passwords-list'>
                {passwordsListElement && passwordsListElement.length > 0 ? (
                    passwordsListElement
                ) : (
                    <p>No passwords for this user</p>
                )}
            </div>

            {/* Add share form */}
            <div className='title'>
                <h2>Share Your Password</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <form onSubmit={handleShareSubmit} className="flex-item-container">
                <input
                    type="text"
                    value={shareUsername}
                    onChange={(e) => setShareUsername(e.target.value)}
                    placeholder="Enter username to share with"
                    required
                />
                <select
                    multiple
                    value={selectedSharePasswordIds}
                    onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        setShareSelectedPasswordIds(selectedOptions);
                    }}
                    required
                >
                    {passowrdsList.map((record) => (
                        <option key={record._id} value={record._id}>
                            {record.url} - {record.password}
                        </option>
                    ))}
                </select>

                <button type="submit">Share Passwords</button>
                {shareError && <p style={{ color: 'red' }}>{shareError}</p>}
            </form>

        </div>
    );
}
