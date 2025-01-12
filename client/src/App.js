import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { loginUser, registerUser } from "./services/authService";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Admin from "./components/Admin";
import User from "./components/User";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster, toast } from "react-hot-toast";
import "./styles/App.css";
import "./styles/loginRegister.css";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    last_name: "",
    address: "",
    city: "",
    country: "",
    phone_number: "",
    email: "",
  });

  const navigate = useNavigate();


// pre railway-a
  // useEffect(() => {
  //   const newSocket = io('http://localhost:5000');
  //   console.log('Socket.IO JE inicijaliziran', newSocket);
  //   setSocket(newSocket);

  //   newSocket.on("connect", () => {
  //     console.log("Socket.IO je ukljucen.");
  //   });

  //   newSocket.on("disconnect", () => {
  //     console.log("Socket.IO je iskljucen.");
  //   });

  //   return () => {
  //     newSocket.off("connect");
  //     newSocket.off("disconnect");
  //     newSocket.off("serverReaction");

  //     console.log('Cleaning up socket');
  //     newSocket.close();
  //   };
  // }, []);

  useEffect(() => {
    const socketURL = window.location.hostname === 'localhost'
      ? 'ws://localhost:5000'  // Use localhost for local development
      : `wss://${window.location.hostname}:${process.env.REACT_APP_PORT || 5000}/`; // Use dynamic port in production
  
    const newSocket = io(socketURL);
    setSocket(newSocket);
    
    newSocket.on("connect", () => {
      console.log("Socket.IO connected.");
    });
  
    newSocket.on("disconnect", () => {
      console.log("Socket.IO disconnected.");
    });
  
    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("serverReaction");
      console.log('Cleaning up socket');
      newSocket.close();
    };
  }, []);
  
  

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    loginUser(formData.email, formData.password)
      .then((data) => {
        if (data.success) {
          toast.success("Login successful!");
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("isAdmin", JSON.stringify(data.user.is_admin));
          localStorage.setItem("user_name", data.user.username);
        
          const redirectPath = data.user.is_admin ? "/admin" : "/user";
          navigate(redirectPath);
        } else {
          toast.error("An error occurred during login.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleRegister = () => {
    registerUser(
      formData.username,
      formData.password,
      formData.name,
      formData.last_name,
      formData.address,
      formData.city,
      formData.country,
      formData.phone_number,
      formData.email
    )
      .then((data) => {
        if (data.success) {
          toast.success("Registration successful!");
          setIsRegistering(false);
        } else {
          toast.error("Registration failed.");
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column w-100" style={{ minHeight: '100vh'}}>
            <Toaster position="top-center" reverseOrder={false} />

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
            <div className="d-flex flex-column align-items-center justify-content-center w-100 min-vh-100 bg-light">
              <div style={{ width: "100%", maxWidth: "600px" }}>
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

                <div className="text-center mt-3">
                  <button onClick={toggleForm} className="btn btn-link">
                    {isRegistering ? "Switch to login" : "Switch to registation"}
                  </button>
                </div>
              </div>
            </div>
            )
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRole="admin">
              {socket ? <Admin socket={socket} handleLogout={handleLogout} /> : <div>Loading...</div>}
            </PrivateRoute>
          }
        />

        <Route
          path="/user"
          element={
            <PrivateRoute allowedRole="user">
              {socket ? <User socket={socket} handleLogout={handleLogout} /> : <div>Loading...</div>}
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
