import React from "react";

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => onSelect("pendingRequests")}>View Pending Requests</li>
      </ul>
    </div>
  );
};

export default Sidebar;
