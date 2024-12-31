import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./AdminSidebar";
import ThemePanel from "./AdminThemes";
import "../styles/Admin.css";
import ThemePanel2 from "./AdminManageTopics";
import Discussions from "./Discussions";


const Admin = ({ socket, handleLogout }) => {
  const[selectedOption, setSelectedOption] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([]);


  const handleSidebarSelect = (option) =>{
    setSelectedOption(option)
  }

  const handleAcceptRequest = (userId) => {
    console.log("Accepting request for user: " + userId);
    //socket.emit("accept_request", { userId }); //necemo ovdje emitovati EVENT (saljemo HTTP)
    fetch(`/approving/accept-request/${userId}`, { method: "PUT" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Request accepted:", data);
      })
      .catch((error) => console.error("Error accepting request:", error));
  };

  const handleRejectRequest = (userId) => {
    console.log("Rejecting request for user: " + userId);
    //socket.emit("reject_request", { userId }); //necemo ovdje emitovati EVENT (saljemo HTTP)
    fetch(`/approving/decline-request/${userId}`, { method: "PUT" })
    .then((response) => response.json())
    .then((data) => {
      console.log("Request accepted:", data);
    })
    .catch((error) => console.error("Error accepting request:", error));
  };

  useEffect(() => {
    console.log(socket);

    if (!socket) return;
     // Učitavanje pending requests na početku
    fetch("/approving/pending-requests") 
      .then((response) => response.json())
      .then((data) => {
        setPendingRequests(data);
      })
      .catch((error) => console.error("Error fetching requests:", error));

    socket.on("pendingRequestsUpdate", (data) => {
        console.log("Pending requests updated:", data);
        setPendingRequests(data); 
    });

    if (selectedOption === "pendingRequests") {
      fetch("/approving/pending-requests") 
      .then((response) => response.json())
      .then((data) => {
        setPendingRequests(data);
      })
      .catch((error) => console.error("Error fetching requests:", error));
    }
    else if (selectedOption === "nekaOpcija") {
      alert("Kliknuli ste na neku opciju!")
    }

    return () => {
      socket.off("updateRequest");
    };
  }, [socket, selectedOption]);

  return (
    <div className="admin-page">
      {/* <button onClick={handleLogout} className="logout-btn">
        Logout
      </button> */}
      <Sidebar onSelect={handleSidebarSelect} handleLogout={handleLogout} />
      
      <div className="content">
        

        {/* Conditionally render content based on selectedOption */}
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
           
            <ThemePanel /> {/* Render ThemePanel for adding a new topic */}
          </div>
        )}

        {/* Handle other options if needed */}
        {selectedOption === "manageTopics" && (
          <div className="divForTopics">
            <ThemePanel2/>
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