import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { getUserByUsername, updateUser } from '../services/authService';
import Discussions from "./Discussions";
import { getUserIdByUsername } from '../services/discussionService'; // ovo treba

const User = ({ socket, handleLogout }) => {
  //TREBA ZA PROP - kod DISKUSIJA
  const [userId, setUserId] = useState(null);

  // USER
  const [editUser, setEditUser] = useState(null); // Podaci o korisniku za uređivanje
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal za uređivanje

  //treba za PROP ZA diskusije
  useEffect(() => {
      const username = sessionStorage.getItem("user_name");
  
      if (username) {
        getUserIdByUsername(username)
          .then((id) => {
            setUserId(id);
          })
          .catch((error) => console.error("Error fetching userId:", error));
      }
    }, []);

   // KOD ZA EDITOVANJE KORISNIKA 
   const openEditModal = async () => {
    const userString = sessionStorage.getItem("user_name");
    console.log(userString);
    
    if (!userString) {
      alert('Nema podataka o korisniku u sesiji.');
      return;
    }
  
    try {
      // treba dobaviti po id-u, jer se id ne menja, medjutim greska kod tokena
      const response = await getUserByUsername(userString);
      console.log(response.user); // Logs the response
      if (response) {
        setEditUser(response.user);  // Update state with the response
      } else {
        alert('Korisnik nije pronađen.');
      }
    } catch (error) {
      console.error('Greška pri parsiranju korisničkih podataka:', error);
      alert('Došlo je do greške pri učitavanju korisničkih podataka.');
    }
  };
  
  // ovde editUser ima vrednost
  useEffect(() => {
    if (editUser) {
      setEditModalOpen(true); 
    }
  }, [editUser]);
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEdit = () => {
    if (!editUser) {
        alert('Nema podataka za ažuriranje korisnika.');
        return;
    }

    const username = sessionStorage.getItem("userName");

    if (!username) {
        alert('Korisničko ime nije pronađeno.');
        return;
    }
  
    const userString = sessionStorage.getItem("user_name");
    updateUser(userString, editUser)
        .then((updatedUser) => {
            console.log('Korisnik uspešno ažuriran:', updatedUser);
            alert('Korisnik uspešno ažuriran.');
            closeEditModal(); 
        })
        .catch((error) => {
            console.error('Greška pri ažuriranju korisnika:', error);
            alert('Došlo je do greške pri ažuriranju korisnika.');
        });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditUser(null);
  };

  useEffect(() => {
    // Ovde možemo dodati socket logiku, ako je potrebno
    return () => {
      socket.off("serverReaction");
      socket.off("mention_notification");
    };
  }, [socket]);

  return (
    <div className="d-flex flex-column w-100" style={{ height: '100vh' }}>

     {/* Centrirana Discussions komponenta sa 70% visine */}
     <div className="d-flex justify-content-center align-items-start" style={{ height: '70vh' }}>
      {userId && <Discussions userId={userId} />}
     </div>

    <div className="d-flex flex-column w-100" style={{ height: '100vh' }}>
      {/* Desni Sidebar */}
      <div className="top-right-controls">
        <div className="in_line">
        <button className="btn btn-info" onClick={openEditModal} style={{ margin: '1rem' }} >Edit</button>
        <button onClick={handleLogout} className="btn btn-secondary"> Logout </button>
        </div>
      </div>
    </div>

      {/* Modal za edit - User */}
      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="modal-content">
            <h4>Edit user</h4>
            <form>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editUser.name || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Lastname:
                <input
                  type="text"
                  name="last_name"
                  value={editUser.last_name || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={editUser.city || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={editUser.country || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone number:
                <input
                  type="text"
                  name="phone_number"
                  value={editUser.phone_number || ''}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editUser.email || ''}
                  onChange={handleInputChange}
                />
              </label>
            </form>
            <button onClick={handleEdit}>Save</button>
            <button onClick={closeEditModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;