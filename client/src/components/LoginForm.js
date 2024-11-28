import React from "react";

const LoginForm = ({ formData, handleChange, handleLogin }) => {
  return (
    <div className="form-container">
      <h2>Prijava</h2>
      <input
        type="text"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Lozinka"
        value={formData.password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Prijavi se</button>
    </div>
  );
};

export default LoginForm;
