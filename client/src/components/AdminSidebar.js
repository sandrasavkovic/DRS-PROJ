import React from "react";

const Sidebar = ({ onSelect, handleLogout }) => {
  const options = [
    { label: "Pending Requests", value: "pendingRequests" },
    //{ label: "Add Topic", value: "addTopic" },
    //{ label: "Manage Topics", value: "manageTopics" },
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
                padding: "15px 20px", // Povećano vertikalno i horizontalno
                fontSize: "18px", // Povećana veličina fonta
                fontWeight: "400", // Polubold font
              }}
              onClick={() => {
                if (option.value === "logout") {
                  handleLogout(); // Poziva handleLogout kada se klikne na Logout
                } else {
                  onSelect(option.value);
                }
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#34495e"} // Hover efekat
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"} // Vraća u originalnu boju
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
