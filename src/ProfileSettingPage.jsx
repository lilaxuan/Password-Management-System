import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Common.css';
import axios from 'axios';

export default function ProfileSettingPage() {
    const { user } = useAuth();
    // if (user) {
    //     console.log('current user is: ', user);
    //     console.log('current user username is: ', user.username);
    // }

    const navigate = useNavigate();
    // hold the data in the form
    const [formData, setFormData] = useState({
        username: user ? user.username : '',
        firstname: user ? user.firstname : '',
        lastname: user ? user.lastname : '',
        email: user ? user.email : '',
        phone: user ? user.phone : '',
        password: user ? user.password : '',
        profileImage: user ? user.profileImage : null
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

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            // Update users profile based on user's id
            const userId = user._id;
            const response = await axios.put(`/api/users/${userId}`, formData);
            console.log("Update successful:", response.data);
        } catch (error) {
            console.error("Error updating user:", error.response ? error.response.data : error.message);
        }
        console.log('Profile has been updated and form data submitted:', formData);
        navigate('/password-manager');
    }

    return (
        <div className="form-content">
            <h2>Profile Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">User Name:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
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

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
