import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [isRegistering, setIsRegistering] = useState(false); // Da li korisnik želi da se registruje
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "", // Dodato za registraciju
  });

  //const navigate = useNavigate();  // Inicijalizujte useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formData.username, password: formData.password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Prijava uspešna!");
          // Ovde možete preusmeriti korisnika na stranicu za prijavljenog korisnika
         // navigate("/PocetnaStranica");  // Preusmeravanje na PocetnaStranica
         window.location.href = "/PocetnaStranica";

        } else {
          alert("Prijava neuspešna. Proverite korisničko ime i lozinku.");
        }
      })
      .catch((err) => console.error("Greška:", err));
  };

  const handleRegister = () => {
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        name: formData.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Registracija uspešna!");
          setIsRegistering(false); // Vraćamo korisnika na prijavu
        } else {
          alert("Greška prilikom registracije.");
        }
      })
      .catch((err) => console.error("Greška:", err));
  };

  return (
    <div className="app-container">
      {isRegistering ? (
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
          <p className="switch-form">
            Već imate nalog?{" "}
            <span onClick={() => setIsRegistering(false)}>Prijavi se</span>
          </p>
        </div>
      ) : (
        <div className="form-container">
          <h2>Prijava</h2>
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
          <button onClick={handleLogin}>Prijavi se</button>
          <p className="switch-form">
            Nemaš nalog?{" "}
            <span onClick={() => setIsRegistering(true)}>Registruj se</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
