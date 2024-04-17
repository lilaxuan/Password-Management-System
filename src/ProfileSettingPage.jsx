import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Common.css';
import axios from 'axios';

export default function ProfileSettingPage() {
    const { user } = useAuth();
    // const [formData, setFormData] = useState({
    //     username: user.username || '',
    //     firstName: user.firstName || '',
    //     lastName: user.lastName || '',
    //     email: user.email || '',
    //     phone: user.phone || '',
    //     password: user.password || '',
    //     profileImage: null // New field for storing uploaded profile image
    // });

    console.log('current user is: ', user);
    console.log('current user username is: ', user.username);
    // hold the data in the form
    const [formData, setFormData] = useState({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        password: user.password,
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

    async function submitProfileChange() {
        await axios.put("/api/users", formData);
    }

    return (
        <div className="form-content">
            <h2>Profile Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
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
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>


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

                <button type="submit" onClick={submitProfileChange}>Save Changes</button>
            </form>
        </div>
    );
}
