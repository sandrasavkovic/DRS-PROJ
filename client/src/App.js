import React, { useState } from "react";
import { loginUser, registerUser } from "./services/authService";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./styles/App.css";

function App() {
  const [isRegistering, setIsRegistering] = useState(false); //Da li se prijavljujemo ili registrujemo (da znamo koju formu prikazujemo)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "", // polje potrebno za registraciju
  });

  // U components folderu su .html fajlovi sa html elementima (forma, dugme...)
  // Klijent je u const interakciji sa tim html elementima

  // U tim fajlovima se POZIVA REAKCIJA na interakciju korisnika sa html elementima (npr. klik na login dugme - handleLogin(reakcija))
  // Ta reakcija je DEFINISANA fjama handleRequest, handleLogin, handleRegister 
  
  // Reakcija podrazumijeva:
  //    - poziv fja iz services foldera (tj. slanje podataka iz forme serveru)
  //    - obrada odgovora servera

  // components - html elementi (poziv reakcije), app.js - reakcije (poziv servisa, obrada odgovora servera)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    loginUser(formData.username, formData.password) //loginUser je servis koji samo salje unesene podatke Serveru
      .then((data) => { //Razlicite poruke u odnosu na to da li je prijava odobrena od strane servera
        if (data.success) { 
          alert(`Prijava uspešna, dobrodošli ${data.user.name}!`); 
          localStorage.setItem('userName', data.user.name);
          window.location.href = "/PocetnaStranica";
        } else {
          alert("Prijava neuspešna. Proverite korisničko ime i lozinku.");
        }
      })
      .catch((err) => console.error("Greška:", err));
  };

  const handleRegister = () => {
    registerUser(formData.username, formData.password, formData.name)
      .then((data) => {
        if (data.success) {
          alert("Registracija uspešna!");
          setIsRegistering(false);
        } else {
          alert("Greška prilikom registracije.");
        }
      })
      .catch((err) => console.error("Greška:", err));
  };

  //Ovo je samo prikaz razlicitih formi
  return (
    <div className="app-container">
      {isRegistering ? (
        <RegisterForm
          formData={formData}
          handleChange={handleChange}
          handleRegister={handleRegister}
        />
      ) : (
        <LoginForm
          formData={formData}
          handleChange={handleChange}
          handleLogin={handleLogin}
        />
      )}
      <p className="switch-form">
        {isRegistering ? (
          <>Već imate nalog? <span onClick={() => setIsRegistering(false)}>Prijavi se</span></>
        ) : (
          <>Nemaš nalog? <span onClick={() => setIsRegistering(true)}>Registruj se</span></>
        )}
      </p>
    </div>
  );
}

export default App;
