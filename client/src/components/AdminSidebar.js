import React from "react";
import '../styles/Admin.css';

const Sidebar = ({ onSelect }) => {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => onSelect("pendingRequests")}>View Pending Requests</li>
        <li onClick={() => onSelect("addTopic")}>Add New Topic</li> {/* Dodata opcija */}
        <li onClick={() => onSelect("manageTopics")}>Manage Topics</li> {/* Nova opcija */}
        <li onClick={() => onSelect("addDiscussion")}>Add Discussion</li> {/* Nova opcija */}
        <li onClick={() => onSelect("manageDiscussion")}>Manage Discussion</li> {/* New option */}
      </ul>
    </div>
  );
};

export default Sidebar;
