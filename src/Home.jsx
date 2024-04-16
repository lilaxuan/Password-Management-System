import React from 'react';
// import { useAuth } from './AuthContext';
// import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import './Home.css';
// import LoginPage from './LoginPage';
// import RegisterPage from './RegisterPage';
// import HomePage from './HomePage';
import Navbar from './Navbar';


export default function Home() {
    return (
        <div>
            <Navbar />
            
        </div>
        // <Router>
        //     <div>
        //         <nav className="navbar">
        //             <Link to="/" >Home</Link>
        //             <Link to="/register" >Register</Link>
        //             <Link to="/login">Login</Link>
        //         </nav>

        //         <Routes>
        //             <Route path="/" element={<HomePage />} />
        //             <Route path="register" element={<RegisterPage />} />
        //             <Route path="login" element={<LoginPage />} />
        //         </Routes>
        //     </div>
        // </Router>
    );
}