import MainPage from "./pages/Homepage/mainpage.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import React from "react";
import './App.css'
import LoginPage from "./pages/Loginpage/Login/login.jsx";
import SignUp from "./pages/Loginpage/SignUp/signUp.jsx";

function App() {
  return (
    <div className="background-login">
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/SignUp" element={<SignUp/>}/>
                <Route path="/MainPage" element={<MainPage/>}/>
            </Routes>
        </Router>
    </div>
  )
}

export default App;
