import React, { useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Admin from "./components/Admin";
import User from "./components/User";
import PrivateRoute from "./components/PrivateRoute"; // For protected routes
import { loginUser, registerUser } from "./services/authService";
import "./styles/App.css";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    import("./styles/loginRegister.css");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    loginUser(formData.email, formData.password)
      .then((data) => {
        if (data.success) {
          alert("Login je uspjesan!");
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("isAdmin", JSON.stringify(data.user.is_admin));
          const redirectPath = data.user.is_admin ? "/admin" : "/user";
          navigate(redirectPath);
        } else {
          alert("Login failed. Please check your username and password.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleRegister = () => {
    registerUser(
      formData.username,
      formData.password,
      formData.name,
      formData.email
    )
      .then((data) => {
        if (data.success) {
          alert("Registration successful!");
          setIsRegistering(false); 
        } else {
          alert("Registration failed. Please try again.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <Routes>
       
        <Route
          path="/login"
          element={
            localStorage.getItem("access_token") ? (
              <Navigate
                to={
                  JSON.parse(localStorage.getItem("isAdmin"))
                    ? "/admin"
                    : "/user"
                }
              />
            ) : (
              <div>
              
                {isRegistering ? (
                  <RegisterForm
                    formData={formData}
                    handleChange={handleChange}
                    handleRegister={handleRegister}
                  />
                ) : (
                  <LoginForm
                    formData={formData}
                    handleChange={handleChange}
                    handleLogin={handleLogin}
                  />
                )}

               
                <button onClick={toggleForm} className="switch-button">
                  {isRegistering ? "Switch to Login" : "Switch to Register"}
                </button>
              </div>
            )
          }
        />

    
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRole="admin">
              <Admin handleLogout={handleLogout} />
            </PrivateRoute>
          }
        />

     
        <Route
          path="/user"
          element={
            <PrivateRoute allowedRole="user">
              <User handleLogout={handleLogout} />
            </PrivateRoute>
          }
        />

      
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
