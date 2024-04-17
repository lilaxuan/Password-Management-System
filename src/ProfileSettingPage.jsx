import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Common.css';

export default function ProfileSettingPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        // Add more fields as needed
        profileImage: null // New field for storing uploaded profile image
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleImageChange(event) {
        const file = event.target.files[0]; // Get the first file from the list
        setFormData(prevState => ({
            ...prevState,
            profileImage: file
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        // Add logic to update user profile with formData
        console.log('Form data submitted:', formData);
        // You may want to call an API to update user profile here
    }

    return (
        <div className="form-content">
            <h2>Profile Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                {/* Add more fields as needed */}

                <div className="form-group">
                    <label htmlFor="profileImage">Profile Image:</label>
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*" // Allow only image files
                        onChange={handleImageChange}
                    />
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
