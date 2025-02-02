import React, { useEffect, useState } from 'react';
import { fetchAllDiscussions, addDiscussion} from "../services/discussionService";
import { fetchThemes} from '../services/themeService';
import DiscussionDisplay from './DiscussionDisplay'; 
import 'font-awesome/css/font-awesome.min.css';
import toast from 'react-hot-toast';
// Ovdje se samo filtriraju sve diskusije!
// NAPOMENA: BITNO!!!
// Discussion objekat u discussions u svim fjama (edit i add) mora imati format kao i u getAllDiscussions
// je se druge fje oslanjaju na ove podatke - bez njih exception!
// Dakle: 
/*
  'id': discussion['id'], 
  'content': discussion['content'],
  'username': discussion['username'], 
  'theme_name': discussion['theme_name'],
  'theme_id': discussion['theme_id'], #dodan je theme_id 
  'post_time': discussion['datetime'], #myb nam ne treba ovo post time al eto nek se nadje
  'name': discussion['name'],
  'surname': discussion['last_name'],
  'email': discussion['email'],
  'user_id' : discussion['user_id']
*/

// IZMJENEEE:
// *****************************************************************************************************************************
// U servisima klijenta dodano polje Authorization (discussionService.js, themeService.js, kod authService.js samo za updateUser)
// SERVER: 
  // U authService.py izmjenjen nacin kreiranja tokena (nije dict vise, samo email) => fja handleLogin
  // U rutama dodano jwt_required 

// TO DO (napomena):
  // approvingService.js se ne koristi? Accept, decline i sl ide preko socket-a, ne htpp zahtjeva
  // osim toga ima i dr stvari koje se ne koriste, brisemo na kraju!


const Discussions = ({ userId , discussions:propDiscussions}) => {

  // dodavanje diskusije
  const [themes, setThemes] = useState([]); // Lista tema
  const [selectedFromList, setSelectedFromList] = useState(null); 
  const [newDiscussionText, setNewDiscussionText] = useState(''); 
  const [isAddModalOpen, setAddModalOpen] = useState(false); 

  // prikaz i filtriranje diskusija
  const [discussions, setDiscussions] = useState([]);
  const [filters, setFilters] = useState({
    searchBy: 'theme_name',
    searchValue: '',
  });

  const handleDiscussionUpdated = (updatedDiscussion) => {
    setDiscussions((prevDiscussions) => {
      const updatedDiscussions = prevDiscussions.map((discussion) =>
        discussion.id === updatedDiscussion.id ? updatedDiscussion : discussion
      );
      return updatedDiscussions.sort((a, b) => new Date(b.post_time) - new Date(a.post_time));
    });
  };

  // Funkcija za brisanje diskusije
  const handleDiscussionDeleted = (deletedDiscussionId) => {
    setDiscussions((prevDiscussions) =>
      prevDiscussions.filter((discussion) => discussion.id !== deletedDiscussionId)
    );
  };


  useEffect(() => {
    fetchAllDiscussions()
      .then((response) => {
        setDiscussions(response.data);
      })
      .catch((error) => console.error('Error fetching discussions:', error));
  }, []); 


  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      searchBy: e.target.value,
      searchValue: '',
    }));
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const searchValueLower = filters.searchValue.toLowerCase();
    let matchesSearch = false;

    if (filters.searchBy === 'theme_name') {
      matchesSearch = discussion.theme_name.toLowerCase().includes(searchValueLower);
    } else if (filters.searchBy === 'name') {
      matchesSearch = discussion.name.toLowerCase().includes(searchValueLower);
    } else if (filters.searchBy === 'surname' && discussion.surname) {
      matchesSearch = discussion.surname.toLowerCase().includes(searchValueLower);
    } else if (filters.searchBy === 'email' && discussion.email) {
      matchesSearch = discussion.email.toLowerCase().includes(searchValueLower);
    }

    return matchesSearch;
  });

 //***ZA DODAVANJE DISKUSIJE */
  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewDiscussionText('');
    setSelectedFromList(null);
  };

  const handleAddDiscussion = () => {
    if (!selectedFromList) {
      toast.error('Please select a theme.');
      return;
    }

    if (newDiscussionText.trim() === '') {
      toast.error('Discussion text cannot be empty.');
      return;
    }
    // saljemo user_id, theme_id, content
    addDiscussion(userId, selectedFromList.id, newDiscussionText)
   
      .then((newDiscussion) => {
        console.log("OVO JE ADMINOV ID : " ,userId);
        toast.success('Discussion added successfully.');
        setDiscussions((prevDiscussions) => [newDiscussion, ...prevDiscussions]);
        closeAddModal();
      })
      .catch((error) => {
        console.error('Error adding discussion:', error);
        toast.error('Failed to add discussion.');
      });
  };

  useEffect(() => {
    fetchThemes()
      .then((response) => {
        setThemes(response.data);
      })
      .catch((error) => console.error('Error fetching themes:', error));

  }, []);

  return (
  <div className="container mt-4">
   <h2 className="text-center mb-4" style={{ color: '#6c757d' }}></h2>
   {/* Add Discussion Modal */}
   {isAddModalOpen && (
      <div className="add-discussion-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Add Discussion</h4>
          </div>

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
              }>
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
              placeholder="Enter your discussion here..."></textarea>
          </form>

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleAddDiscussion}>
              Add
            </button>
            <button className="btn btn-secondary" onClick={closeAddModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}
   <div className="d-flex justify-content-center mb-4 align-items-center">
    <div className="btn-group" role="group" aria-label="Search by">
      {['theme_name', 'name', 'surname', 'email'].map((type) => (
        <label
          key={type}
          className="btn"
          style={{
            color: '#6c757d', // Siva boja teksta
            backgroundColor: filters.searchBy === type ? '#f8f9fa' : 'transparent', // Bela pozadina kada je selektovano
            border: 'none', // Ukloni border
            padding: '5px 10px', // Malo razmaka oko teksta
            cursor: 'pointer', // Pokazuje da je klikabilno
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f8f9fa'; // Pozadina se menja na hover
          }}
          onMouseLeave={(e) => {
            if (filters.searchBy !== type) {
              e.target.style.backgroundColor = 'transparent'; // Vraća se u transparent ako nije selektovano
            }
          }}
        >
          <input
            type="radio"
            name="searchBy"
            value={type}
            checked={filters.searchBy === type}
            onChange={handleRadioChange}
            style={{
              marginRight: '8px', // Razmak između inputa i teksta
              accentColor: '#6c757d', // Postavljanje boje radio dugmeta (ako je selektovano)
            }}
          />
          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
        </label>
      ))}
    </div>

      <div className="mx-2" style={{ maxWidth: '300px' }}>
        <input
          type="text"
          name="searchValue"
          value={filters.searchValue}
          onChange={handleFilterChange}
          className="form-control"
          placeholder="Enter search text..."
        />
      </div>

      <div>
        <button
          className="btn btn-outline-secondary"
          onClick={openAddModal}
          style={{ margin: '1rem' }}>
          <i className="fa fa-plus" style={{ marginRight: '0.5rem' }}></i> {/* Plus ikona */}
          Create Post
        </button>
      </div>
    </div>

    <div className="d-flex flex-column align-items-center">
      {filteredDiscussions.length > 0 ? (
        filteredDiscussions.map((discussion) => (
          <DiscussionDisplay 
          key={discussion.id} 
          discussion={discussion} 
          userId={userId} 
          themes={themes} // OVO je dodano za meni kod selektovanja teme
          onDiscussionUpdated={handleDiscussionUpdated}
          onDiscussionDeleted={handleDiscussionDeleted}/>
        ))
      ) : (
        <p>No discussions found matching your search criteria.</p>
      )}
    </div>
  </div>

  );
};

export default Discussions;
