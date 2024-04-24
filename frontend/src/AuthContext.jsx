// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Since the user information shall be updated and shared accross all pages, so it's been added in the provider

    // Function to log in a user
    const login = (userData) => {
        setUser(userData);
    };

    // Function to log out a user
    const logout = () => {
        setUser(null);

    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
