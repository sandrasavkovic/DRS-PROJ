import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { fetchThemes, fetchDiscussions } from '../services/themeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { getUserByUsername, updateUser } from '../services/authService';
import { addDiscussion } from '../services/themeService';
const User = ({ socket, handleLogout }) => {
  const [themes, setThemes] = useState([]); // Lista tema
  const [filteredThemes, setFilteredThemes] = useState([]); // Filtrirane teme
  const [searchTerm, setSearchTerm] = useState(''); // Unos u polje za pretragu
  const [selectedTheme, setSelectedTheme] = useState(null); // Selektovana tema
  const [discussionText, setDiscussionText] = useState(''); // Tekst diskusije
  const [discussions, setDiscussions] = useState([]); // Diskusije za selektovanu temu
  const [editUser, setEditUser] = useState(null); // Podaci o korisniku za uređivanje
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal za uređivanje

  // novi kod , ZA EDITOVANJE KORISNIKA 
   // za edit korisnika : 
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
  
  // Open the modal after editUser is updated
  // ovde editUser ima vrednost
  useEffect(() => {
    if (editUser) {
      setEditModalOpen(true); // Open modal only when editUser is updated
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
    console.log("AAAAAAA")
    console.log(editUser.name)
    console.log(editUser.id)
    if (!username) {
        alert('Korisničko ime nije pronađeno.');
        return;
    }
      // poziva se funkcija iz servisa react-a
      // koja salje id i editovanogUsera
    const userString = sessionStorage.getItem("user_name");
    updateUser(userString, editUser)
        .then((updatedUser) => {
            console.log('Korisnik uspešno ažuriran:', updatedUser);
            alert('Korisnik uspešno ažuriran.');
            closeEditModal(); // Close the modal after successful update
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
////////

  // Rukovanje promenom u polju za pretragu
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = themes.filter((theme) =>
      theme.title.toLowerCase().includes(value)
    );
    setFilteredThemes(filtered);
  };

  // Rukovanje klikom na temu u levom sidebaru
  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    // Dohvatanje diskusija za selektovanu temu
    handleFetchDiscussions(theme.id);
  };

  // Dohvatanje diskusija za selektovanu temu
  const handleFetchDiscussions = (themeId) => {
    fetchDiscussions(themeId) // Pretpostavljam da fetchDiscussions uzima id teme i vraća diskusije
      .then((response) => {
        setDiscussions(response.data); // Stavljanje diskusija u state
      })
      .catch((error) => {
        console.error('Greška pri dohvatiti diskusije:', error);
      });
  };

  // Rukovanje unosom diskusije
  const handlePublishDiscussion = () => {
    if (!selectedTheme) {
      alert('Molimo izaberite temu pre objave diskusije.');
      return;
    }
    if (discussionText.trim() === '') {
      alert('Tekst diskusije ne može biti prazan.');
      return;
    }

    // Simulacija dodavanja diskusije u selektovanu temu
    console.log(`Diskusija za temu "${selectedTheme.theme_name}":`, discussionText);
    // diskusija treba biti za temu sa odredjenim id-em
    addDiscussion(selectedTheme, discussionText)

    // Resetovanje unosa nakon objave
    setDiscussionText('');
  };

  useEffect(() => {
    fetchThemes()
      .then((response) => {
        const sortedThemes = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setThemes(sortedThemes);
        setFilteredThemes(sortedThemes);
      })
      .catch((error) => console.error('Error fetching themes:', error));

    // Ovde možete dodati socket logiku, ako je potrebno
    return () => {
      socket.off("serverReaction");
      socket.off("mention_notification");
    };
  }, [socket]);

  return (
    <div className="page-container">
  
      <div className="sidebar-left">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pretraži teme..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="theme-list">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-item ${
                selectedTheme && selectedTheme.id === theme.id ? 'selected' : ''
              }`}
              onClick={() => handleSelectTheme(theme)}
            >
              <h4>{theme.id}</h4>
              <p>{theme.theme_name}</p>
              <p>{theme.date_time}</p>
            </div>
          ))}
        </div>
      </div>
  
      <div className="discussion-list">
        {discussions.length > 0 && (
          <div className="discussions-list">
            <h5>Diskusije:</h5>
            {discussions.map((discussion) => (
              <div key={discussion.id} className="discussion-item">
                <h6>{discussion.title}</h6>
                <p>{discussion.content}</p>
                <small>{discussion.user_id}</small>
              </div>
            ))}
          </div>
        )}
      </div>
  
      <div className="sidebar-right">
        <div className="discussion-section">
          {selectedTheme ? (
            <h4>Diskusija za temu: {selectedTheme.theme_name}</h4>
          ) : (
            <h4>Izaberite temu za diskusiju</h4>
          )}
  
          <textarea
            value={discussionText}
            onChange={(e) => setDiscussionText(e.target.value)}
            placeholder="Unesite svoju diskusiju ovde..."
            rows="5"
          />
          <button onClick={handlePublishDiscussion}>Objavi</button>
          
        </div>
        <div className="header">
        <FontAwesomeIcon
          icon={faUserEdit}
          className="edit-icon"
          onClick={openEditModal}
        />
       </div>
      </div>

      {/* Modal for Editing User */}
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
