import React, { useEffect, useState } from 'react';
import { fetchAllDiscussions } from "../services/discussionService";
import DiscussionDisplay from './DiscussionDisplay'; // Import the new DiscussionDisplay component
// Ovdje se samo filtriraju sve diskusije!

const Discussions = ({ userId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [filters, setFilters] = useState({
    searchBy: 'theme_name',
    searchValue: '',
  });


  useEffect(() => {
  
    fetchAllDiscussions()
      .then((response) => {
        setDiscussions(response.data);
      })
      .catch((error) => console.error('Error fetching discussions:', error));
  }, []); // This will run once when the component mounts


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

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Diskusije</h2>

      <div className="d-flex justify-content-center mb-4">
        <div className="form-group mx-2">
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
        </div>

        <div className="form-group mx-2" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            name="searchValue"
            value={filters.searchValue}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Unesite tekst za pretragu..."
          />
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <DiscussionDisplay 
            key={discussion.id} 
            discussion={discussion} 
            userId={discussion.user_id} // Prosleđivanje userId kao prop
          />
          ))
        ) : (
          <p>No discussions found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Discussions;
