import React from "react";

const User = ({ handleLogout }) => {
  return (
    <div className="user-container">
      <h1>Welcome User</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default User;
