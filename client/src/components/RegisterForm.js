import React from "react";

const RegisterForm = ({ formData, handleChange, handleRegister }) => {
  return (
    <div className="card p-4 shadow" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center mb-4">Registracija</h2>
      <div className="mb-3">
        <input
          type="text"
          name="username"
          placeholder="Korisničko ime"
          value={formData.username}
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
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Ime"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="last_name"
          placeholder="Prezime"
          value={formData.last_name}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="address"
          placeholder="Adresa"
          value={formData.address}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="city"
          placeholder="Grad"
          value={formData.city}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="country"
          placeholder="Država"
          value={formData.country}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="phone_number"
          placeholder="Broj telefona"
          value={formData.phone_number}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button onClick={handleRegister} className="btn btn-success w-100">
        Potvrdi registraciju
      </button>
    </div>
  );
};

export default RegisterForm;
