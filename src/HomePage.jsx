import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navbar from './Navbar.jsx';



export default function HomePage() {

    return (
        <div>
            {/* <AuthProvider> */}
            {/* <Navbar /> */}
            {/* </AuthProvider> */}
            This is the home page!!
        </div>
    )
}