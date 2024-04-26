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

    const [passwordDetails, setPasswordDetails] = useState({});


    // Selected Records {key (shareRequestId): {details: pendingPasswordRecord; seleced: true/false})}
    // Fetch password details whenever selectedRecords change
    useEffect(() => {
        const fetchPasswords = async () => {
            const details = {};
            for (const key of Object.keys(selectedRecords)) {
                const passwordId = selectedRecords[key].details.passwordId;
                const response = await axios.get(`/api/passwords/${passwordId}`);
                details[key] = response.data;
            }
            console.log('details - 11111: ', details);
            setPasswordDetails(details);
        };

        if (selectedRecords) {
            fetchPasswords();
        }
    }, [selectedRecords]); // Re-run when selectedRecords changes



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
