import React from "react";

const Sidebar = ({ onSelect, handleLogout }) => {
  const options = [
    { label: "Pending Requests", value: "pendingRequests" },
    { label: "Topics View", value: "topicsView" },
    { label: "Discussions View", value: "discussionsView" },
    { label: "Logout", value: "logout" }, // Dodali smo opciju Logout kao dugme
  ];

  return (
    <div className="d-flex flex-column h-100" style={{ backgroundColor: "#2c3e50", color: "#fff" }}>
      {/* Opcije */}
      <ul className="nav flex-column mt-2" style={{position:'fixed'}}>
        {options.map((option) => (
          <li className="nav-item" key={option.value} >
            <button
              className="nav-link text-start w-100"
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                textAlign: "left",
                padding: "15px 20px", 
                fontSize: "18px", 
                fontWeight: "400", 
              }}
              onClick={() => {
                if (option.value === "logout") {
                  handleLogout(); 
                } else {
                  onSelect(option.value);
                }
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#34495e"} // Hover efekat
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"} 
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
