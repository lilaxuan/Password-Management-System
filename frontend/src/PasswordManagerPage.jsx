import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './PasswordManagerPage.css';
import PasswordModal from './PasswordModal';


export default function PasswordManagerPage() {
    const navigate = useNavigate(); // navigate accross different pages.
    const { user, login } = useAuth();
    const [url, setUrl] = useState('');
    const [password, setPassword] = useState([]);
    const [passowrdsList, setPasswordsList] = useState([]);
    const [passwordsListElement, setPasswordsListElement] = useState([]); // the elements to be rendered on the page
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
    const [receivedPasswordsList, setReceivedPasswordsList] = useState([]);
    const [acceptedPasswordsList, setAcceptedPasswordsList] = useState([]);
    const [acceptedPasswordsElements, setAcceptedPasswordsElements] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingPasswordsList, setPendingPasswordsList] = useState([]);

    if (!user) {
        navigate('/login');
        return null;
    }

    async function getAllPasswordsRecords() {
        if (!user) {
            navigate('/login');
            return null;
        }

        const userId = user._id;
        const response = await axios.get(`/api/passwords/users/${userId}`);
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
        setPasswordsList(allPasswordsRecords);
        setPasswordsListElement(passwordsListElement);
    }

    // Get all received passwords for the current user
    async function getAllAcceptedPasswords(event) {
        if (user) {
            const allRecievedPasswords = user.receivedPasswords;
            setAcceptedPasswordsList(allRecievedPasswords);

            const allAcceptedPasswordsElements = [];
            for (let i = 0; i < allRecievedPasswords.length; i++) {
                // only display passwords that are accepted
                if (allRecievedPasswords[i].status === "accepted") {
                    // in order to get the info of the shared password
                    const sharedPasswordObject = await axios.get(`/api/passwords/${allRecievedPasswords[i].passwordId}`)

                    allAcceptedPasswordsElements.push(
                        <div>{sharedPasswordObject.data.url} - {sharedPasswordObject.data.password} from {allRecievedPasswords[i].sharedUsername}</div>
                    )
                }
            }
            setAcceptedPasswordsElements(allAcceptedPasswordsElements);
        }
    }

    function onStart() {
        getAllPasswordsRecords();
        getAllAcceptedPasswords();
        getPendingPasswordsList();
    }

    useEffect(() => {
        onStart();
    }, [user]);


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
    }

    async function deletePasswordRecord(passwordRecordId) {
        console.log('id is: ', passwordRecordId);
        console.log('start deleteing');
        await axios.delete(`/api/passwords/${passwordRecordId}`);
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, pad with leading zero
        const day = date.getDate().toString().padStart(2, '0'); // Pad with leading zero
        return `${year}-${month}-${day}`;
    }

    function togglePasswordVisibility(id, initialVisibilityState) {
        const pre = initialVisibilityState[id];
        initialVisibilityState[id] = !pre;
        console.log('updated initialVisibilityState: ', initialVisibilityState);
        setInitialVisibilityState(initialVisibilityState);
        getAllPasswordsRecords();
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
            // Use Post to create a new ShareRequest based on every selected passwords ids.
            const response = await axios.get(`/api/users/by-username/${shareUsername}`);
            const recipientUser = response.data;
            console.log('recipientUser: ', recipientUser);
            if (!recipientUser) {
                setShareError('User Not Found!');
            }
            for (let i = 0; i < selectedSharePasswordIds.length; i++) {
                const response = await axios.post('/api/share/send', {
                    passwordId: selectedSharePasswordIds[i],
                    ownerId: user._id,
                    recipientId: recipientUser._id,
                    status: "pending"
                });
                if (response.status === 201) {
                    alert('Share request sent.');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setShareError('Username does not exist.');
            } else {
                setShareError('An error occurred while sending the share request.');
            }
        }
    };

    function getPendingPasswordsList() {
        if (user) {
            const receivedPasswordsList = user.receivedPasswords;
            const pendingPasswordsList = [];
            for (let i = 0; i < receivedPasswordsList.length; i++) {
                if (receivedPasswordsList[i].status === 'pending') {
                    pendingPasswordsList.push(receivedPasswordsList[i]);
                }
            }
            setPendingPasswordsList(pendingPasswordsList);
        }
    }

    // Updates the status of the share request
    // passwordId: "66298e13ae75e6d508856093"
    // sharedReuqestId: "662c09163dfcd703a9cf00de"
    // sharedUserId: "66200f4a97eeef38f24c2af6"
    // sharedUsername: "emma"
    // status: "pending"
    // _id: "662c09163dfcd703a9cf00e3"
    async function handleAccept(selectedRecords) {
        console.log('Accepted Records:', selectedRecords);
        for (let i = 0; i < selectedRecords.length; i++) {
            const sharedReuqestId = selectedRecords[i].sharedReuqestId;
            const newShareReuqest = {
                passwordId: selectedRecords[i].passwordId,
                ownerId: selectedRecords[i].sharedUserId,
                recipientId: user._id,
                status: "accepted"
            }
            await axios.put(`/api/share/accept/${sharedReuqestId}`, newShareReuqest);
        }
        alert('Accepted the password share request');
    };

    async function handleRefuse(selectedRecords) {
        console.log('Refused Records:', selectedRecords);
        for (let i = 0; i < selectedRecords.length; i++) {
            const sharedReuqestId = selectedRecords[i].sharedReuqestId;
            const newShareReuqest = {
                passwordId: selectedRecords[i].passwordId,
                ownerId: selectedRecords[i].sharedUserId,
                recipientId: user._id,
                status: "refused"
            }
            await axios.put(`/api/share/refuse/${sharedReuqestId}`, newShareReuqest);
        }
        alert('Accepted the password share request');
    };

    function checkSharedPasswords() {
        getAllAcceptedPasswords(); // updates the accepted passwords often
        getPendingPasswordsList(); // updates the pending passwords often
        setModalOpen(true);
    }

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

            <div className='title'> <h2>Passwords shared by other users</h2></div>
            <div>{acceptedPasswordsElements && acceptedPasswordsElements.length > 0 ? (
                acceptedPasswordsElements
            ) : (
                <p>No passwords received from other users</p>
            )}</div>

            <div>
                <button onClick={checkSharedPasswords}>Check Shared Passwords Request</button>
                {modalOpen && (
                    <PasswordModal
                        pendingPasswordRecords={pendingPasswordsList}
                        onClose={() => setModalOpen(false)}
                        onAccept={handleAccept}
                        onRefuse={handleRefuse}
                    />
                )}
            </div>

        </div>
    );
}


// async function getAllUsers() {
//     const allUsersObject = await axios.get('/api/users');
//     const allUsersList = []
//     for (let i = 0; i < allUsersObject.length; i++) {
//         allUsersList.push(allUsersObject[i].username);
//     }
//     setAllUsers(allUsersList);
// }

// useEffect(() => {
//     const intervalId = setInterval(() => {
//         console.log('interval called!!');
//         getPendingPasswordsList();
//         getAllAcceptedPasswords();
//     }, 3000); // every 3 second updates the pending passwords list, and accepted passwords element
//     return () => clearInterval(intervalId);
// }, []);