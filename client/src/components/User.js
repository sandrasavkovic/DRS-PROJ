import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { fetchThemes, fetchDiscussions, fetchDiscussionsOfUser } from '../services/themeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { getUserByUsername, updateUser } from '../services/authService';
import { addDiscussion } from '../services/themeService';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { getDiscussionById, updateDiscussion, deleteDiscussion } from '../services/themeService';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the delete icon
import Discussions from "./Discussions";

//treba ovo
import { getUserIdByUsername } from '../services/discussionService';

const User = ({ socket, handleLogout }) => {
  //TREBA ZA PROP - kod DISKUSIJA
  const [userId, setUserId] = useState(null);

  //Teme
  const [themes, setThemes] = useState([]); // Lista tema
  const [filteredThemes, setFilteredThemes] = useState([]); // Filtrirane teme
  const [searchTerm, setSearchTerm] = useState(''); // Unos u polje za pretragu
  const [selectedTheme, setSelectedTheme] = useState(null); // Selektovana tema

  const [discussionText, setDiscussionText] = useState(''); // Tekst diskusije
  const [discussions, setDiscussions] = useState([]); // Diskusije za selektovanu temu
  const [editUser, setEditUser] = useState(null); // Podaci o korisniku za uređivanje
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Modal za uređivanje
  const [editDiscussion, setEditDiscussion] = useState(null);
  const [isEditDiscussionModalOpen, setEditDiscussionModalOpen] = useState(false); // Modal za uređivanje
  const [userDiscussions, setUserDiscussions] = useState([]); // Discussions of the logged-in user

  const [isUserDiscussionsVisible, setUserDiscussionsVisible] = useState(false); // New state
  const [isDiscussionsVisible, setDiscussionsVisible] = useState(false); // New state

  // za dodavanje diskusije
  const [selectedFromList, setSelectedFromList] = useState(null); // Selected theme for new discussion
  const [newDiscussionText, setNewDiscussionText] = useState(''); // New discussion text
  const [isAddModalOpen, setAddModalOpen] = useState(false); // Modal for adding a new discussion

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

  //***ZA DODAVANJE DISKUSIJE */

  // Open the "Add Discussion" modal
  const openAddModal = () => {
    setAddModalOpen(true);
  };

  // Close the "Add Discussion" modal
  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewDiscussionText('');
    setSelectedFromList(null);
  };

  // Handle new discussion submission
  const handleAddDiscussion = () => {
    if (!selectedFromList) {
      alert('Please select a theme.');
      return;
    }

    if (newDiscussionText.trim() === '') {
      alert('Discussion text cannot be empty.');
      return;
    }

    // Call the addDiscussion service
    addDiscussion(selectedFromList, newDiscussionText)
      .then(() => {
        alert('Discussion added successfully.');
        closeAddModal(); // Close the modal after submission
      })
      .catch((error) => {
        console.error('Error adding discussion:', error);
        alert('Failed to add discussion.');
      });
  };

  
  // ****ZA EDIT DISKUSIJA KORISNIKA KOJI JE TRENUTNO LOGOVAN 
    // dobavicemo sve diskusije trenutno logovanog korisnika (iz sessionStorage-a)
 const handleFetchUserDiscussions = async() => {
    const username = sessionStorage.getItem("user_name");

    if (!username) {
      alert('Nema podataka o korisniku u sesiji.');
      return;
    }

    fetchDiscussionsOfUser(username) // Assuming fetchDiscussions can handle fetching by username
      .then((response) => {
        if (response) {
          console.log(response.discussions); // You might also want to log response.data here
          setUserDiscussions(response.discussions); // This should be an array
          setUserDiscussionsVisible(!isUserDiscussionsVisible); // Toggle visibility
          setDiscussionsVisible(false);
        } else {
          console.error('Nema diskusija u odgovoru');
        }
      })
      .catch((error) => {
        console.error('Greška pri dohvatiti diskusije korisnika:', error);
        alert('Došlo je do greške pri učitavanju diskusija korisnika.');
      });
  };


  useEffect(() => {
    if (editDiscussion) {
      setEditDiscussionModalOpen(true); // Open modal only when editUser is updated
    }
  }, [editDiscussion]);
  
  
  const handleInputDiscussionChange = (e) => {
    const { name, value } = e.target;
  setEditDiscussion((prevDiscussion) => ({ ...prevDiscussion, [name]: value }));
  }

  const handleEditDiscussion = () => {
   // salje izmenjeni objekat bekendu 
   if (!editDiscussion) {
    alert('No discussion to update.');
    return;
  }
  console.log("SALJEM NA IZMENU OVU DISKUSIJU  ID:", editDiscussion.id)
  console.log(editDiscussion)
  updateDiscussion(editDiscussion.id, editDiscussion)
    .then(() => {
      alert('Discussion updated successfully.');
      setEditDiscussionModalOpen(false); // Close modal
      setEditDiscussion(null); // Reset state
      handleFetchUserDiscussions(); // Refresh user's discussions
    })
    .catch((error) => {
      console.error('Error updating discussion:', error);
      alert('Failed to update discussion.');
    });
};


  const closeEditDiscussionModal = () => {
    setEditDiscussionModalOpen(false);
    setEditDiscussion(null);
  };

  // prosledimo diskusiju kao parametr, klikom na edit button se salje kao parametar u ovu funkciju
  const handleUserDiscussionEdit = (discussion) =>{
    console.log(discussion.id)
    console.log(discussion.content)
    
    // poziva se na klik pen-a
    // treba da dobavimo diskusiju po prosledjenom id-u
    // u modalu za edit prosledimo dobavljenu diskusiju
    getDiscussionById(discussion.id)
    .then((response) => {
      console.log(response.discussion);
      setEditDiscussion(response.discussion); // Set the discussion data in state
    })
    .catch((error) => {
      console.error('Error fetching discussion:', error);
      alert('Failed to fetch the discussion for editing.');
    });
    // klikom na save handleEditDiscussion 
    
  }

//******************BRISANJE DISKUSIJE */
// Function to handle discussion deletion
const handleDeleteDiscussion = (discussionId) => {
  console.log(`Deleting discussion with ID: ${discussionId}`);
  // Assuming you have a service function `deleteDiscussion`
  deleteDiscussion(discussionId)
    .then(() => {
      alert('Discussion deleted successfully.');
      handleFetchUserDiscussions(); // Refresh user's discussions
    })
    .catch((error) => {
      console.error('Error deleting discussion:', error);
      alert('Failed to delete discussion.');
    });
};

///////////////////////////////////
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

  // Rukovanje klikom na temu u levom sidebaru
  const handleSelectTheme = (theme) => {
    console.log(theme);
    setSelectedTheme(theme);
    // Dohvatanje diskusija za selektovanu temu
    handleFetchDiscussions(theme.id);
    setUserDiscussionsVisible(false);
    setDiscussionsVisible(true);
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

  // Rukovanje promenom u polju za pretragu - ispravljen exception
  const handleSearchChange = (e) => {
    const value = e.target.value; 
    setSearchTerm(value);
  
    if (!value.trim()) {
      setFilteredThemes(themes);
      return;
    }
    //admin mijenja, dodaje i brise teme, koristii socket da obavijestimo korisnika o promjeni
    //ovako samo jednom trazimo listu tema i ne azuriramo je nikad - kad se implementira to kod admina
    const filtered = themes.filter(
      (theme) =>
        theme &&
        theme.theme_name &&
        theme.theme_name.toLowerCase().includes(value.toLowerCase()) 
    );
    console.log(filtered);

    setFilteredThemes(filtered);
  };

  useEffect(() => {
    fetchThemes()
      .then((response) => {
        const sortedThemes = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        console.log(sortedThemes)
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
    <div className="d-flex flex-column w-100" style={{ height: '100vh' }}>
    {/* Logout Button */}
    {/* <button onClick={handleLogout} className="logout-btn">
      Logout
    </button> */}
  
     {/* Centrirana Discussions komponenta sa 70% visine */}
     <div className="d-flex justify-content-center align-items-start" style={{ height: '70vh' }}>
      {/* Prosleđivanje samo userId kao prop u Discussions */}
      {userId && <Discussions userId={userId} />}
    </div>


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
              {/* <p>{theme.date_time}</p> */}
            </div>
          ))}
        </div>
      </div>
      
      
      
      {isEditDiscussionModalOpen && (
      <div className="edit-modal">
        <div className="modal-content">
            <h4>Uredi diskusiju</h4>
            <form>
                <label>
                    Naslov:
                    <input
                        type="text"
                        name="title"
                        value={editDiscussion?.title || ''}
                        onChange={handleInputDiscussionChange}
                    />
                </label>
                <label>
                    Sadržaj:
                    <textarea
                        name="content"
                        value={editDiscussion?.content || ''}
                        onChange={handleInputDiscussionChange}
                        rows="5"
                    />
                </label>
            </form>
            <button onClick={handleEditDiscussion}>Sačuvaj</button>
            <button onClick={closeEditDiscussionModal}>Zatvori</button>
        </div>
      </div>
      )}

    <div className="d-flex flex-column w-100" style={{ height: '100vh' }}>
      {/* Right Sidebar */}
      <div className="top-right-controls">
        <div className="in_line">
        <button
          className="btn btn-info"
          onClick={openAddModal}
          style={{ margin: '1rem' }}
        >
        Add
        </button>
        <button className="btn btn-info" onClick={openEditModal} style={{ margin: '1rem' }} >Edit</button>
        {/* <FontAwesomeIcon
          icon={faUserEdit}
          className="edit-icon"
          onClick={openEditModal}
        /> */}
      <button onClick={handleLogout} className="btn btn-secondary">
      Logout
    </button>
        </div>

        {/* Add Discussion Modal */}
        {isAddModalOpen && (
          <div className="edit-modal">
           <div className="modal-content">
              <h4>Add Discussion</h4>
              <form>
                <label htmlFor="themeDropdown">Select Theme:</label>
                <select
                id="themeDropdown"
                className="form-select"
                value={selectedFromList ? selectedFromList.id : ''}
                onChange={(e) =>
                  setSelectedFromList(
                    themes.find((theme) => theme.id === parseInt(e.target.value))
                  )
                }
              >
                <option value="" disabled>
                  Choose a theme...
                </option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.theme_name}
                  </option>
                ))}
              </select>

              <label htmlFor="discussionText" className="mt-3">
                Discussion Text:
              </label>
              <textarea
                id="discussionText"
                className="form-control"
                rows="5"
                value={newDiscussionText}
                onChange={(e) => setNewDiscussionText(e.target.value)}
                placeholder="Enter your discussion here..."
              ></textarea>
            </form>

            <div className="mt-3">
              <button
                className="btn btn-info me-2"
                onClick={handleAddDiscussion}
              >
                Add
              </button>
              <button className="btn btn-secondary" onClick={closeAddModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
       {/* <div className="header">
        <FontAwesomeIcon
          icon={faUserEdit}
          className="edit-icon"
          onClick={openEditModal}
        />
        <FontAwesomeIcon
          icon={faList}
          className="fetch-icon"
          onClick={handleFetchUserDiscussions}
        />
       </div> */}
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


      {/* Discussions List */}
      <div className="discussion-list">
        {isUserDiscussionsVisible && (
          <div className="discussions-list">
            <h5></h5>
            
            {userDiscussions.map((discussion) => (
              <div key={discussion.id} className="discussion-item">
                <h6>{discussion.title}</h6>
                <p>{discussion.content}</p>
                <p>{discussion.datetime}</p>
                <FontAwesomeIcon
                  icon={faPen}
                  className="edit-icon1"
                  onClick={() => handleUserDiscussionEdit(discussion)}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className="delete-icon"
                  onClick={() => handleDeleteDiscussion(discussion.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



export default User;