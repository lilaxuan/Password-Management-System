// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Modal.css';

// function PasswordModal({ pendingPasswordRecords, onClose, onAccept, onRefuse }) {
//     const [pendingPasswordsElements, setPendingPasswordsElements] = useState([]);
//     const [selectedRecords, setSelectedRecords] = useState({});
//     const [acceptRequest, setAcceptRequest] = useState(false);


//     async function getPendingPasswordsElements() {
//         const pendingPasswordsElements = [];
//         const selectedRecords = [];
//         for (let i = 0; i < pendingPasswordRecords.length; i++) {
//             const record = pendingPasswordRecords[i];
//             const passwordId = record.passwordId;
//             const response = await axios.get(`/api/passwords/${passwordId}`);
//             console.log('response: ', response);
//             const password = response.data;


//             pendingPasswordsElements.push(
//                 <div key={password._id} className="record">
//                     <label>
//                         {/* <input type="checkbox" checked={!selectedRecords[record._id]} onChange={() => toggleRecord(record._id)} /> */}
//                         {/* <input type="checkbox" checked={!selectedRecords[record._id]} onChange={() => toggleRecord(password._id)} /> */}
//                         <label>
//                             <input type="checkbox" checked={acceptRequest} onChange={e => setAcceptRequest(e.target.checked)} />
//                             Select
//                         </label>
//                         {password.url} - {password.password}
//                     </label>
//                 </div>
//             )
//         }
//         setSelectedRecords(selectedRecords);
//         setPendingPasswordsElements(pendingPasswordsElements);
//     }

//     useEffect(() => {
//         getPendingPasswordsElements();
//     }, []);

//     // Initialize the selectedRecords state when the component mounts or the passwordRecords change
//     useEffect(() => {
//         const initialSelections = {};
//         pendingPasswordRecords.forEach(record => {
//             initialSelections[record.passwordId] = false;
//         });
//         setSelectedRecords(initialSelections);
//         console.log("initialSelections: ", initialSelections);
//     }, []);

//     // const toggleRecord = (id) => {
//     //     console.log('hihi - selectedRecords111: ', selectedRecords);
//     //     console.log("hihi2", id);
//     //     setSelectedRecords(prev => ({
//     //         ...prev,
//     //         [id]: !prev[id]
//     //     }));
//     //     console.log('hihi - selectedRecords222: ', selectedRecords);
//     // };

//     const handleAccept = () => {
//         console.log('selectedRecords: ', selectedRecords);
//         onAccept(selectedRecords);
//     };

//     const handleRefuse = () => {
//         onRefuse(selectedRecords);
//     };

//     return (
//         <div className="modal">
//             <div className="modal-content">
//                 <h2>Pending Password Records</h2>
//                 <div>
//                     {pendingPasswordsElements && pendingPasswordsElements.length > 0 ? (
//                         pendingPasswordsElements
//                     ) : (
//                         <p>No pending passwords received from other users</p>
//                     )}
//                 </div>
//                 <div className="buttons">
//                     <button onClick={handleAccept}>Accept</button>
//                     <button onClick={handleRefuse}>Refuse</button>
//                     <button onClick={onClose}>Close</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default PasswordModal;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

// // pendingPasswordRecords
// // {
// //     "shareRequestId": "---",
// //     "passwordId": "6629a23bf52066db96b8065b",
// //     "sharedUserId": "66200f4a97eeef38f24c2af6",
// //     "sharedUsername": "emma",
// //     "status": "pending",
// //     "_id": "662b4e867415da6f970df2be"
// // },

function PasswordModal({ pendingPasswordRecords, onClose, onAccept, onRefuse }) {
    console.log("pendingPasswordRecords", pendingPasswordRecords);
    const [selectedRecords, setSelectedRecords] = useState({});
    const [pendingPasswordsElements, setPendingPasswordsElements] = useState([]);
    const [url, setUrl] = useState("");
    const [password, setPassword] = useState("");

    // async function getPendingPasswordsElements() {
    //     const pendingPasswordsElements = [];
    //     for (let i = 0; i < pendingPasswordRecords.length; i++) {
    //         const record = pendingPasswordRecords[i];
    //         const passwordId = record.passwordId;
    //         const response = await axios.get(`/api/passwords/${passwordId}`);
    //         const password = response.data;
    //         pendingPasswordsElements.push(
    //             <div>
    //                 <label>
    //                     <input
    //                         type="checkbox"
    //                         checked={selectedRecords[pendingPasswordRecords[i]._id].selected}
    //                         onChange={() => toggleRecord(pendingPasswordRecords[i]._id)}
    //                     />
    //                     {password.url} - {password.password}
    //                 </label>
    //             </div>

    //             // <div key={password._id} className="record">
    //             //     <label>
    //             //         {/* <input type="checkbox" checked={!selectedRecords[record._id]} onChange={() => toggleRecord(record._id)} /> */}
    //             //         {/* <input type="checkbox" checked={!selectedRecords[record._id]} onChange={() => toggleRecord(password._id)} /> */}
    //             //         <label>
    //             //             {/* <input type="checkbox" checked={acceptRequest} onChange={e => setAcceptRequest(e.target.checked)} /> */}
    //             //             {/* Select */}
    //             //             <input
    //             //                 type="checkbox"
    //             //                 checked={selectedRecords[key].selected}
    //             //                 onChange={() => toggleRecord(key)}
    //             //             />
    //             //             {password.url} - {password.password}
    //             //         </label>
    //             //         {password.url} - {password.password}
    //             //     </label>
    //             // </div>
    //         )
    //     }
    //     setPendingPasswordsElements(pendingPasswordsElements);
    // }

    // useEffect(() => {
    //     getPendingPasswordsElements();
    // }, []);

    useEffect(() => {
        const fetchPasswords = async () => {
            let selectedRecordsInitial = {};
            for (let record of pendingPasswordRecords) {
                // const response = await axios.get(`/api/passwords/${record.passwordId}`);
                selectedRecordsInitial[record._id] = {
                    selected: false,
                    details: record
                };
            }
            console.log("selectedRecordsInitial: ", selectedRecordsInitial);
            setSelectedRecords(selectedRecordsInitial);
        };

        if (pendingPasswordRecords.length > 0) {
            fetchPasswords();
        }
    }, [pendingPasswordRecords]);

    const toggleRecord = (id) => {
        setSelectedRecords(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                selected: !prev[id].selected
            }
        }));
    };

    const handleAccept = () => {
        const acceptedRecords = Object.keys(selectedRecords)
            .filter(key => selectedRecords[key].selected)
            .map(key => selectedRecords[key].details);
        onAccept(acceptedRecords);
    };

    const handleRefuse = () => {
        const refusedRecords = Object.keys(selectedRecords)
            .filter(key => selectedRecords[key].selected)
            .map(key => selectedRecords[key].details);
        onRefuse(refusedRecords);
    };


    // async function getPassword(key) {
    //     console.log('get password: selected records: ', selectedRecords);
    //     console.log('get password: key: ', key);
    //     const passwordId = selectedRecords[key].details.passwordId;
    //     console.log('get password: passwordId: ', passwordId);
    //     const response = await axios.get(`/api/passwords/${passwordId}`);
    //     console.log('get password: response: ', response);
    //     const password = response.data;
    //     console.log('----------------------------------');
    //     setUrl(password.url);
    //     setPassword(password.password);
    //     return password;
    // }

    const [passwordDetails, setPasswordDetails] = useState({});


    // Selected Records {key (shareRequestId): {details: pendingPasswordRecord; seleced: true/false})}
    // Fetch password details whenever selectedRecords change
    useEffect(() => {
        const fetchPasswords = async () => {
            const details = {};
            for (const key of Object.keys(selectedRecords)) {
                // if (selectedRecords[key].selected) {
                const passwordId = selectedRecords[key].details.passwordId;
                const response = await axios.get(`/api/passwords/${passwordId}`);
                details[key] = response.data;
                // }
            }
            console.log('details - 11111: ', details);
            setPasswordDetails(details);
        };

        if (selectedRecords) {
            fetchPasswords();
        }
    }, [selectedRecords]); // Re-run when selectedRecords changes

    // useEffect(() => {
    //     getPassword()
    // }, [selectedRecords])


    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Pending Password Records</h2>
                <div>
                    {Object.keys(selectedRecords).map(key => (
                        <div key={key} className="record">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedRecords[key].selected}
                                    onChange={() => toggleRecord(key)}
                                />
                                {/* cannot use async all in JSX directly!! */}
                                {/* {(await getPassword(key)).url} - {(await getPassword(key)).password} */}
                                {passwordDetails[key] ? `${passwordDetails[key].url} - ${passwordDetails[key].password}` : 'Loading...'}
                            </label>
                        </div>
                    ))}
                    {Object.keys(selectedRecords).length === 0 && <p>No pending passwords received from other users</p>}
                </div>
                {/* <div>
                    {pendingPasswordsElements && pendingPasswordsElements.length > 0 ? (
                        pendingPasswordsElements
                    ) : (
                        <p>No pending passwords received from other users</p>
                    )}
                </div> */}
                <div className="buttons">
                    <button onClick={handleAccept}>Accept</button>
                    <button onClick={handleRefuse}>Refuse</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default PasswordModal;
