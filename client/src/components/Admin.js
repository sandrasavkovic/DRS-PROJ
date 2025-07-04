import React, { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar";
import AdminCRUD from "./AdminCRUD";
import Discussions from "./Discussions";
import { fetchThemes } from "../services/themeService";
import { getUserIdByUsername } from '../services/discussionService'; // ovo treba

const Admin = ({ socket, handleLogout }) => {
  const [selectedOption, setSelectedOption] = useState("pendingRequests");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isThemesLoading, setThemesLoading] = useState(false);
  const [themes, setPropThemes] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const handleSidebarSelect = (option) => {
    setSelectedOption(option);
  };
  
  
  useEffect(() => {
    setThemesLoading(true);
    fetchThemes()
      .then((response) => {
        setPropThemes(response.data);
        setThemesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching themes:", error);
        setThemesLoading(false);
      });
  }, []);
  
 useEffect(() => {
      const username = localStorage.getItem("user_name");
  
      if (username) {
        getUserIdByUsername(username)
          .then((id) => {
            setAdminId(id);
          })
          .catch((error) => console.error("Error fetching userId:", error));
      }
    }, []);


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
    <div className="admin-page container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light border-end p-0">
          <Sidebar
            onSelect={handleSidebarSelect}
            handleLogout={handleLogout}
          />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          {selectedOption === "pendingRequests" && (
            <div className="container mt-4">
              {pendingRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                <ul className="list-group">
                  {pendingRequests.map((request) => (
                    <li
                      key={request[0]}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {request[3]} {request[4]} ({request[9]})
                      </span>
                      <div>
                        <button
                          className="btn btn-info"
                          onClick={() => handleAcceptRequest(request[0])}>
                          Accept
                        </button>
                        <button
                          className="btn custom-btn-info"
                          onClick={() => handleRejectRequest(request[0])}>
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}


          {selectedOption === "topicsView" && (
            <AdminCRUD themes={themes} isLoading={isThemesLoading} />
          )}
          {selectedOption === "discussionsView" && (
            <Discussions 
            userId={adminId}
              className="w-60 bg-light"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
