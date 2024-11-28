import React from "react";

const RegisterForm = ({ formData, handleChange, handleRegister }) => {
  return (
    <div className="form-container">
      <h2>Registracija</h2>
      
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
      
      <input
        type="text"
        name="name"
        placeholder="Ime"
        value={formData.name}
        onChange={handleChange}
      />
      
      <input
        type="text"
        name="last_name"
        placeholder="Prezime"
        value={formData.last_name}
        onChange={handleChange}
      />
      
      <input
        type="text"
        name="address"
        placeholder="Adresa"
        value={formData.address}
        onChange={handleChange}
      />
      
      <input
        type="text"
        name="city"
        placeholder="Grad"
        value={formData.city}
        onChange={handleChange}
      />
      
      <input
        type="text"
        name="country"
        placeholder="Država"
        value={formData.country}
        onChange={handleChange}
      />
      
      <input
        type="text"
        name="phone_number"
        placeholder="Broj telefona"
        value={formData.phone_number}
        onChange={handleChange}
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      
      <button onClick={handleRegister}>Potvrdi registraciju</button>
    </div>
  );
};

export default RegisterForm;
