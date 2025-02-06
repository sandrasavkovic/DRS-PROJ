import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { getUserByUsername, updateUser } from '../services/authService';
import Discussions from "./Discussions";
import { getUserIdByUsername } from '../services/discussionService'; // ovo treba
import toast from 'react-hot-toast';

const User = ({ socket, handleLogout }) => {
  //TREBA ZA PROP - kod DISKUSIJA

  const [userId, setUserId] = useState(null);

  // USER
  const [editUser, setEditUser] = useState(null); // Podaci o korisniku za uređivanje
  const [originalUser, setOriginalUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal za uređivanje
  
  //treba za PROP ZA diskusije
  useEffect(() => {
      const username = localStorage.getItem("user_name");
  
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
    const userString = localStorage.getItem("user_name");
    console.log(userString);
    
    if (!userString) {
      toast.error('No user data in session.');
      return;
    }
  
    try {
      // treba dobaviti po id-u, jer se id ne menja, medjutim greska kod tokena
      const response = await getUserByUsername(userString);
      console.log(response.user); // Logs the response
      if (response) {
        setEditUser(response.user);  // Update state with the response
        setOriginalUser(response.user);
      } else {
        toast.error('User not found.');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('An error occurred while loading user data.');
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
        toast.error('There is no data to update the user.');
        return;
    }

    const isDataChanged = Object.keys(editUser).some(
      (key) => editUser[key] !== originalUser[key]
    );

    if (!isDataChanged) {
      toast.error('No changes detected.'); // Show a message if no fields were changed
      return;
    }
    const username = localStorage.getItem("userName");

    if (!username) {
        toast.error('Username not found.');
        return;
    }
  
    const userString = localStorage.getItem("user_name");
    updateUser(userString, editUser)
        .then((updatedUser) => {
            console.log('User successfully updated:', updatedUser);
            toast.success('User successfully updated.');
            closeEditModal(); 
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            toast.error('An error occurred while updating the user.');
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
    <div style={{ minHeight: '100vh'}}>

     {/* Centrirana Discussions komponenta sa 70% visine */}
     <div className="d-flex justify-content-center align-items-start" style={{ height: '80vh' }}>
      {userId && <Discussions userId={userId} />}
     </div>

    <div className="d-flex flex-column w-100">
      {/* Desni Sidebar */}
      <div className="top-right-controls">
        <div className="in_line">
        {/* Edit Button with Profile Icon */}
<button
  className="btn btn-white border-0"
  onClick={openEditModal}
  style={{
    margin: '1rem',
    color: '#2980b9', // Blue color for the profile icon
    fontSize: '1.8em', // Adjust icon size
    backgroundColor: 'transparent', // Transparent background
  }}
  title="Edit Profile"
>
  <i className="bi bi-person-circle"></i> {/* Profile icon */}
</button>

{/* Logout Button with Logout Icon */}
<button
  onClick={handleLogout}
  className="btn btn-white border-0"
  style={{
    color: '#dc3545', // Red color for the logout icon
    fontSize: '1.8em', // Adjust icon size
    backgroundColor: 'transparent', // Transparent background
  }}
  title="Logout"
>
  <i className="bi bi-box-arrow-right"></i> {/* Logout icon */}
</button>

        </div>
      </div>
    </div>

      {/* Modal za edit - User */}
      {isEditModalOpen && (
      <div className="edit-user-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Edit User</h4>
        </div>
      <div className="modal-body">
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
            placeholder="Last Name"
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
            placeholder="Phone Number"
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
            disabled
          />
        </div>
        </div>
         <div className="modal-footer">
          <button onClick={handleEdit} className="btn btn-primary">Save</button>
          <button onClick={closeEditModal} className="btn btn-secondary">Close</button>
         </div>
        </div>
       </div>
      )}

    </div>
  );
};

export default User;