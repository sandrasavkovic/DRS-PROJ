import React, { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar";
import "../styles/Admin.css";
import { fetchPendingRequests, acceptRequest, declineRequest } from "../services/approvingService";
import io from "socket.io-client";

const Admin = ({ handleLogout }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  const handleSidebarSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
 
    socket.on("request_approved", (data) => {
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request[0] !== data.user_id) 
      );
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  

  useEffect(() => {
    if (selectedOption === "pendingRequests") {
      const getRequests = async () => {
        const requests = await fetchPendingRequests(); 
        console.log("Fetched pending requests:", requests);
        setPendingRequests(requests);
      };
      getRequests();
    }
  }, [selectedOption]);

  const handleAccept = async (userId) => {
    const result = await acceptRequest(userId);
    if (result.success) {
  
      console.log(`Request for user ${userId} accepted.`);
    }
  };

  const handleDecline = async (userId) => {
    const result = await declineRequest(userId); 
    if (result.success) {
     
      console.log(`Request for user ${userId} declined.`);
    }
  };

  return (
    <div className="admin-page">
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      <Sidebar onSelect={handleSidebarSelect} />
      <div className="content">
        <h1>Welcome Admin</h1>
        {selectedOption === "pendingRequests" && (
          <div>
            <h2>Pending Registration Requests</h2>
            {pendingRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <ul>
                {pendingRequests.map((request) => (
                  <li key={request[0]}>
                    <span>
                      {request[3]} {request[4]} ({request[9]}) 
                    </span>
                    <button onClick={() => handleAccept(request[0])}>Accept</button>
                    <button onClick={() => handleDecline(request[0])}>Decline</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
