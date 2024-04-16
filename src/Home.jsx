import React from 'react';
// import { useAuth } from './AuthContext';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import './Home.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePageContent from './HomePageContent';
import PasswordManagerPage from './PasswordManagerPage';
import Navbar from './Navbar';
import ProfileSettingPage from './ProfileSettingPage';


export default function Home() {
    return (
        // <div>
        //     <Navbar />
        // </div>
        // <Router>
        //     <div>
        //         <nav className="navbar">
        //             <Link to="/" >Home</Link>
        //             <Link to="/register" >Register</Link>
        //             <Link to="/login">Login</Link>
        //         </nav>

        //         {/* Routes Definitions */}
        //         <Routes>
        //             <Route path="/" element={<HomePageContent />} />
        //             <Route path="/register" element={<RegisterPage />} />
        //             <Route path="/login" element={<LoginPage />} />
        //             <Route path="/password-manager" element={<PasswordManagerPage />} />
        //         </Routes>
        //     </div>
        // </Router>

        <Router>
            <div>
                <Navbar />

                {/* Routes Definitions */}
                <Routes>
                    <Route path="/" element={<HomePageContent />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/password-manager" element={<PasswordManagerPage />} />
                    <Route path="/profile-setup" element={<ProfileSettingPage />} />
                </Routes>
            </div>
        </Router>
    );
}