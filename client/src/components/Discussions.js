import React, { useEffect, useState } from 'react';
import { fetchAllDiscussions } from "../services/discussionService";
import { fetchThemes} from '../services/themeService';
import { addDiscussion } from '../services/themeService';
import DiscussionDisplay from './DiscussionDisplay'; 
import 'font-awesome/css/font-awesome.min.css';

// Ovdje se samo filtriraju sve diskusije!
// NAPOMENA: BITNO!!!
// Discussion objekat u discussions u svim fjama (edit i add) mora imati format kao i u getAllDiscussions
// je ser druge fje oslanjaju na ove podatke - bez njih exception!
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

//Zbog ovoga je izmjenje Edit i Add discussions,
//Dodani su prop u DiscussionDisplay da se promjene (edit i brisanje) propagira u roditeljsku komponentu (OVU - Discussions)

//BAZA IZMJENE:
//Obrisana je kolona Title u Discussions
//Dodano je unique ogranicenje za theme_name

//Sta ne radi? 
// Admin dodavanje/izmjena tema i propagacija promjea u user, ostalo nisam stigla provjeriti
// Front za izgled post ostavi meni (nisam stigla zavrsiti)
// Iz nekog razloga je disableovan like/dislike za DRUGU diskusiju 
  // npr obrise se diskusija 1 i onda diskusija koja je bila diskusija 2 je sad prva
  // i onda se moze like/dislike, aliii diskusija koja je bila diskusija 3 je sad druga 
  // i onda se NE moze like/dislike (cudno!!)

const Discussions = ({ userId }) => {

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

  //Callback funkcija za edit i brisanje diskusije
  //NAPOMENA: DiscussionDisplay je komponenta za 1 diskusiju, dakle za svaku diskusiju onda imamo 1 DiscussionDisplay komp
  //Po azuriranju te jedne komponente moramo javiti roditejskoj (ovoj komponenti) jer ona sadrzi SVE diskusije
  //Ovdje se tim callback fjama azurira/obrise ta diskusija u listi svih diskusija
  // Funkcija za ažuriranje diskusije
  const handleDiscussionUpdated = (updatedDiscussion) => {
    setDiscussions((prevDiscussions) =>
      prevDiscussions.map((discussion) =>
        discussion.id === updatedDiscussion.id ? updatedDiscussion : discussion
      )
    );
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
      alert('Please select a theme.');
      return;
    }

    if (newDiscussionText.trim() === '') {
      alert('Discussion text cannot be empty.');
      return;
    }
    // saljemo user_id, theme_id, content
    addDiscussion(userId, selectedFromList.id, newDiscussionText)
      .then(() => {
        alert('Discussion added successfully.');
        closeAddModal();
      })
      .catch((error) => {
        console.error('Error adding discussion:', error);
        alert('Failed to add discussion.');
      });
  };

  useEffect(() => {
    fetchThemes()
      .then((response) => {
        const sortedThemes = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setThemes(sortedThemes);
      })
      .catch((error) => console.error('Error fetching themes:', error));

    /* Ovde možemo dodati socket logiku, ako je potrebno
    return () => {
      socket.off("serverReaction");
      socket.off("mention_notification");
    };*/ 
    // u uglaste zagrade socket i proslije kao prop onda!
  }, []);

  return (
  <div className="container mt-4">
    <h2 className="text-center mb-4">Discussions</h2>

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
              placeholder="Enter your discussion here..."
            ></textarea>
          </form>

          <div className="mt-3">
            <button className="btn btn-info me-2" onClick={handleAddDiscussion}>
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
          <label key={type} className="btn btn-outline-primary">
            <input
              type="radio"
              name="searchBy"
              value={type}
              checked={filters.searchBy === type}
              onChange={handleRadioChange}
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
