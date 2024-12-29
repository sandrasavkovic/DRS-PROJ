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
      alert('No user data in session.');
      return;
    }
  
    try {
      // treba dobaviti po id-u, jer se id ne menja, medjutim greska kod tokena
      const response = await getUserByUsername(userString);
      console.log(response.user); // Logs the response
      if (response) {
        setEditUser(response.user);  // Update state with the response
      } else {
        alert('User not found.');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      alert('An error occurred while loading user data.');
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
        alert('There is no data to update the user.');
        return;
    }

    const username = sessionStorage.getItem("userName");

    if (!username) {
        alert('Username not found.');
        return;
    }
  
    const userString = sessionStorage.getItem("user_name");
    updateUser(userString, editUser)
        .then((updatedUser) => {
            console.log('User successfully updated:', updatedUser);
            alert('User successfully updated.');
            closeEditModal(); 
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            alert('An error occurred while updating the user.');
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

    <div className="d-flex flex-column w-100">
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
        <div className="card p-4 shadow" style={{maxWidth: "500px",position: "absolute",
          top: "180px", // Razmak ispod dugmeta
          right: "10px", // Razmak od desne ivice
        }}>
          <h2 className="text-center mb-4">Edit user</h2>
          <div className="mb-3">
              <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editUser.name || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
            </div>
            <div className="mb-3">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={editUser.last_name || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={editUser.city || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={editUser.country || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
             </div>
             <div className="mb-3">
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone number"
                  value={editUser.phone_number || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editUser.email || ''}
                  onChange={handleInputChange}
                  className="form-control"
                />
             </div>
            <button onClick={handleEdit} className="btn btn-success w-100">Save</button>
            <button onClick={closeEditModal} className="btn btn-secondary w-100 mt-2">Close</button>
          </div>
      )}
    </div>
  );
};

export default User;