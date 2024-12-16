import React from "react";

const LoginForm = ({ formData, handleChange, handleLogin }) => {
  return (
    <div className="card p-4 shadow" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center mb-4">Prijava</h2>
      <div className="mb-3">
        <input
          type="text"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button onClick={handleLogin} className="btn btn-primary w-100">
        Prijavi se
      </button>
    </div>
  );
};

export default LoginForm;
