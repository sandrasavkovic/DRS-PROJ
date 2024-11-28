import React from "react";

const RegisterForm = ({ formData, handleChange, handleRegister }) => {
  return (
    <div className="form-container">
      <h2>Registracija</h2>
      <input
        type="text"
        name="name"
        placeholder="Ime"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="username"
        placeholder="Korisničko ime"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Lozinka"
        value={formData.password}
        onChange={handleChange}
      />
      <button onClick={handleRegister}>Potvrdi registraciju</button>
    </div>
  );
};

export default RegisterForm;
