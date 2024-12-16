import React, { useEffect, useState } from 'react';
import { fetchAllDiscussions, } from "../services/discussionService"; 
import 'font-awesome/css/font-awesome.min.css'; // FontAwesome icons
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; // Tooltip from React-Bootstrap
import {updateDiscussion, getDiscussionById, deleteDiscussion } from '../services/themeService';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [filters, setFilters] = useState({
    searchBy: 'theme_name',  // Default filter: 'theme_name'
    searchValue: '',
  });
  const [isEditDiscussionModalOpen, setEditDiscussionModalOpen] = useState(false);
  const [editDiscussion, setEditDiscussion] = useState(null); // State for discussion to edit

  const loggedUser = sessionStorage.getItem("user_name");

  useEffect(() => {
    fetchAllDiscussions()
      .then((response) => {
        const diskusije = response.data;
        console.log(diskusije);
        setDiscussions(diskusije);
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

  const handleDeleteDiscussion = (discussionId) => {
    console.log(`Deleting discussion with ID: ${discussionId}`);
    deleteDiscussion(discussionId)
      .then(() => {
        alert('Discussion deleted successfully.');
        setDiscussions(discussions.filter(disc => disc.id !== discussionId)); // Refresh discussions
      })
      .catch((error) => {
        console.error('Error deleting discussion:', error);
        alert('Failed to delete discussion.');
      });
  };

  const handleUserDiscussionEdit = (discussion) => {
    console.log('Editing discussion:', discussion);
    getDiscussionById(discussion.id)
      .then((response) => {
        console.log(response.discussion);
        setEditDiscussion(response.discussion);
        setEditDiscussionModalOpen(true); // Open modal
      })
      .catch((error) => {
        console.error('Error fetching discussion:', error);
        alert('Failed to fetch the discussion for editing.');
      });
  };

  const handleInputDiscussionChange = (e) => {
    const { name, value } = e.target;
    setEditDiscussion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditDiscussion = () => {
    // Implement the save logic here (e.g., update discussion via API)
    updateDiscussion(editDiscussion.id, editDiscussion)
    
    console.log('Saving edited discussion:', editDiscussion);
    // Close modal after saving
    setEditDiscussionModalOpen(false);
  };

  const closeEditDiscussionModal = () => {
    setEditDiscussionModalOpen(false);
  };

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

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

      {/* Search Filters */}
      <div className="d-flex justify-content-center mb-4">
        {/* Radio Buttons */}
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

        {/* Search Input */}
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

      {/* Discussions List */}
      <div className="d-flex flex-column align-items-center">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <div key={discussion.id} className="mb-4 w-75">
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between">
                  <small className="text-muted">Username: {discussion.username}</small>
                  <small className="text-muted">Tema: {discussion.theme_name}</small>
                  <small className="text-muted">Sadržaj: {discussion.content}</small>

                </div>
                <div className="card-body">
                  <h5 className="card-title">{discussion.title}</h5>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <div>
                    <button className="btn btn-outline-success btn-sm mx-1">
                      <i className="fa fa-thumbs-up"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm mx-1">
                      <i className="fa fa-thumbs-down"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mx-1"
                      data-toggle="collapse"
                      data-target={`#comments-${discussion.id}`}
                    >
                      <i className="fa fa-comment"></i>
                    </button>
                  </div>
                  {discussion.username === loggedUser && (
                    <div>
                      <button
                        className="btn btn-outline-secondary btn-sm mx-1"
                        onClick={() => handleUserDiscussionEdit(discussion)}
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm mx-1"
                        onClick={() => handleDeleteDiscussion(discussion.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No discussions found matching your search criteria.</p>
        )}
      </div>

      {/* Edit Discussion Modal */}
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
    </div>
  );
};

export default Discussions;
