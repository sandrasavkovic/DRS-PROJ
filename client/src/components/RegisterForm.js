import React from "react";

const RegisterForm = ({ formData, handleChange, handleRegister }) => {
  return (
    <div className="card p-4 shadow" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center mb-4">Registration</h2>
      <div className="mb-3">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="First name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="last_name"
          placeholder="Last name"
          value={formData.last_name}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="country"
          placeholder="County"
          value={formData.country}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="phone_number"
          placeholder="Phone number"
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
      Confirm registration
      </button>
    </div>
  );
};

export default RegisterForm;
