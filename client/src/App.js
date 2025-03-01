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
import { jwtDecode } from "jwt-decode";

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
// pazi !! ovde sam dodala direktno adresu za render, nema localhosta


useEffect(() => {
  // Initialize the socket connection
  const newSocket = io('https://drs-proj-server.onrender.com', {
    transports: ['websocket'], // Explicitly define the transport (WebSocket)
    secure: true,
  });

  // Log Socket.IO connection and error events
  newSocket.on("connect", () => {
    console.log("Socket.IO je ukljucen.");
  });

  newSocket.on("connect_error", (error) => {
    console.log("Socket.IO connection error:", error);  // Log any connection errors
  });

  newSocket.on("disconnect", () => {
    console.log("Socket.IO je iskljucen.");
  });

  newSocket.on("serverReaction", (data) => {
    console.log("Server reaction:", data.message);  // Handling server reaction
  });

  console.log('Socket.IO JE inicijaliziran', newSocket);

  // Set the socket in the state
  setSocket(newSocket);

  // Cleanup function to remove event listeners and close the socket
  return () => {
    console.log('Cleaning up socket');
    newSocket.off("connect");
    newSocket.off("connect_error");
    newSocket.off("disconnect");
    newSocket.off("serverReaction");

    newSocket.close();  // Close the socket connection
  };
}, []);  // Empty dependency array ensures this runs only once when component mounts

  // useEffect(() => {
  //   const socketURL = window.location.hostname === 'localhost'
  //     ? 'ws://localhost:5000'  // Use localhost for local development
  //     : `wss://${window.location.hostname}:${process.env.REACT_APP_PORT || 5000}/`; // Use dynamic port in production
  
  //   const newSocket = io(socketURL);
  //   setSocket(newSocket);
    
  //   newSocket.on("connect", () => {
  //     console.log("Socket.IO connected.");
  //   });
  
  //   newSocket.on("disconnect", () => {
  //     console.log("Socket.IO disconnected.");
  //   });
  
  //   return () => {
  //     newSocket.off("connect");
  //     newSocket.off("disconnect");
  //     newSocket.off("serverReaction");
  //     console.log('Cleaning up socket');
  //     newSocket.close();
  //   };
  // }, []);
  
/*
  useEffect(() => {
    const socketURL = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000'  // Use localhost for local development
      : 'https://drs-proj-server.onrender.com'; // Use production URL for Render
  
    const newSocket = io(socketURL, {
      transports: ['websocket'],  // Ensure WebSocket transport is used
      withCredentials: true,  // jer koristimo tokene za aut
    });
  
    console.log('Socket.IO initialized', newSocket);
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
  
  const preventRefresh = (e) => {
    e.preventDefault();
    e.returnValue = "Data will get lost!";
    return "Data will get lost!";
  };
*/
  // // deo za zatvaranje tab-a
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     console.log(sessionStorage.getItem('isClosing'));
  //     sessionStorage.setItem('isClosing', 'true');
  //     setTimeout(() => {
  //       sessionStorage.removeItem('isClosing'); // zbog ovog delay-a ako je u pitanju refresh a ne zatv taba
  //       // flag ce se ukloniti pa se nece desiti unload tj logout
  //     }, 100); 
  //     console.log("AA");
  //     console.log(sessionStorage.getItem('isClosing'));

  //     e.preventDefault();
  //     e.returnValue = "Data will get lost!";
  //   };

  //   const handleUnload = () => {
  //     if (sessionStorage.getItem('isClosing') === 'true') {
  //         handleLogout();
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   window.addEventListener('unload', handleUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     window.removeEventListener('unload', handleUnload);
  //   };
  // }, []); 

    const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds
        const expirationDate = new Date(decoded.exp * 1000);
    
        console.log("Token istice: ", expirationDate.toLocaleString());
        return decoded.exp < currentTime; // Check if the token has expired
      } catch (e) {
        console.error("Error decoding token", e);
        return true;
      }
    };
  
    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token && isTokenExpired(token)) {
        toast.error("Session expired. Please log in again.");
        handleLogout();
      }
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
