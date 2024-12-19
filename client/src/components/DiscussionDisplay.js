import React, { useState, useEffect } from 'react';
import { updateDiscussion, getDiscussionById, deleteDiscussion } from '../services/themeService';
import 'font-awesome/css/font-awesome.min.css';
import DiscussionAction from './DiscussionAction'; 

// Ovdje se definise izgled pojedinacne diskusije, handle edit, delete

const DiscussionDisplay = ({ discussion, userId }) => {
  const [isEditDiscussionModalOpen, setEditDiscussionModalOpen] = useState(false);
  const [editDiscussion, setEditDiscussion] = useState(null);

  const loggedUser = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("isAdmin");

  useEffect(() => {
    console.log("diskusija se mijenja mora u uglaste zagrade")
  }, [discussion]);

  const handleDeleteDiscussion = (discussionId) => {
    deleteDiscussion(discussionId)
      .then(() => {
        alert('Discussion deleted successfully.');
        window.location.reload(); // Refresh page after delete
      })
      .catch((error) => {
        console.error('Error deleting discussion:', error);
        alert('Failed to delete discussion.');
      });
  };

  const handleUserDiscussionEdit = (discussion) => {
    getDiscussionById(discussion.id)
      .then((response) => {
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
    updateDiscussion(editDiscussion.id, editDiscussion)
      .then(() => {
        alert('Discussion updated successfully.');
        setEditDiscussionModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating discussion:', error);
        alert('Failed to update discussion.');
      });
  };

  const closeEditDiscussionModal = () => {
    setEditDiscussionModalOpen(false);
  };

  return (
    <div className="mb-4 w-75">
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
          {/* Displaying DiscussionAction component */}
          <DiscussionAction 
            discussion={discussion} 
            userId={userId}
          />
          <div>
            {discussion.username === loggedUser && (
              <button
                className="btn btn-outline-secondary btn-sm mx-1"
                onClick={() => handleUserDiscussionEdit(discussion)}
              >
                <i className="fa fa-pencil"></i>
              </button>
            )}
            {(discussion.username === loggedUser || Number(role) === 1) && (
              <button
                className="btn btn-outline-danger btn-sm mx-1"
                onClick={() => handleDeleteDiscussion(discussion.id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            )}
          </div>
        </div>
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

export default DiscussionDisplay;
