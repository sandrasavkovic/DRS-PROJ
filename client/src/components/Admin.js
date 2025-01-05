import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./AdminSidebar";
import ThemePanel from "./AdminThemes";
import "../styles/Admin.css";
import ThemePanel2 from "./AdminManageTopics";
import Discussions from "./Discussions";


const Admin = ({ socket, handleLogout }) => {
  const [selectedOption, setSelectedOption] = useState("pendingRequests")
  const [pendingRequests, setPendingRequests] = useState([]);

  const handleSidebarSelect = (option) =>{
    setSelectedOption(option)
  }

  useEffect(() => {
    if (!socket) return;
  
    socket.emit("getPendingRequests");
  
    socket.on("pendingRequestsUpdate", (data) => {
      console.log("Pending requests updated:", data);
      setPendingRequests(data);
    });
  
    socket.on("errorMessage", (error) => {
      console.error("Error received:", error);
      alert(`Error: ${error}`);
    });
  
    return () => {
      socket.off("pendingRequestsUpdate");
      socket.off("errorMessage");
    };
  }, [socket]);
  
  const handleAcceptRequest = (userId) => {
    console.log("Accepting request for user: " + userId);
    socket.emit("acceptRequest", { userId });
  };
  
  const handleRejectRequest = (userId) => {
    console.log("Rejecting request for user: " + userId);
    socket.emit("rejectRequest", { userId });
  };

  return (
    <div className="admin-page">
    
      <Sidebar onSelect={handleSidebarSelect} handleLogout={handleLogout} />
      
      <div className="content">
       
        {selectedOption === "pendingRequests" && (
          <div className="container mt-4">
          {pendingRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            
              <ul className="list-group">
                {pendingRequests.map((request) => (
                  <li key={request[0]} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {request[3]} {request[4]} ({request[9]})
                    </span>
                    <div>
                      <button
                        className="btn btn-info"
                        onClick={() => handleAcceptRequest(request[0])}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleRejectRequest(request[0])}
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
           
          )}
        </div>
      )}

        {selectedOption === "addTopic" && (
          <div>
            <ThemePanel /> {/* dodavanje nove teme */}
          </div>
        )}

        {selectedOption === "manageTopics" && (
          <div>
            <ThemePanel2 />
          </div>
        )}

        {selectedOption === "discussionsView" &&(
          <div>
            <Discussions className="w-60 bg-light" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;