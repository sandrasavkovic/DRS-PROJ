import React from "react";
import "../styles/Admin.css";

const Sidebar = ({ onSelect, handleLogout }) => {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => onSelect("pendingRequests")}>View Pending Requests</li>
        <li onClick={() => onSelect("addTopic")}>Add New Topic</li>
        <li onClick={() => onSelect("manageTopics")}>Manage Topics</li>
        <li onClick={() => onSelect("discussionsView")}>Discussions</li>
      </ul>
      {/* Logout button at the bottom with custom styles */}
      <button className="logout-btn btn-secondary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
