import React, { useState, useEffect } from 'react';
import { modifyDiscussion, deleteDiscussion } from '../services/themeService';
import 'font-awesome/css/font-awesome.min.css';
import DiscussionAction from './DiscussionAction';

const DiscussionDisplay = ({ discussion, userId, themes, onDiscussionUpdated, onDiscussionDeleted }) => {
  const [isEditDiscussionModalOpen, setEditDiscussionModalOpen] = useState(false);
  const [editDiscussion, setEditDiscussion] = useState(null);
  
  const loggedUser = localStorage.getItem("user_name");
  const role = localStorage.getItem("isAdmin");
  
  useEffect(() => {
    console.log("diskusija se mijenja mora u uglaste zagrade")
  }, [discussion, themes]);

  const handleDeleteDiscussion = () => {
    deleteDiscussion(discussion.id)
      .then(() => {
        alert('Discussion deleted successfully.');
        onDiscussionDeleted(discussion.id); // Callback for parent component
      })
      .catch((error) => {
        console.error('Error deleting discussion:', error);
        alert('Failed to delete discussion.');
      })
  };

  const handleEditDiscussion = () => {
    modifyDiscussion(discussion.id, editDiscussion)
      .then((updatedDiscussion) => {
        alert('Discussion updated successfully.');
        onDiscussionUpdated(updatedDiscussion);  // Update in parent component
        setEditDiscussionModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating discussion:', error);
        alert('Failed to update discussion.');
      })
  };

  const handleUserDiscussionEdit = () => {
    setEditDiscussion({
      ...discussion,
      content: discussion.content,
      theme_id: discussion.theme_id, 
    });
    setEditDiscussionModalOpen(true);
  };

  const handleInputDiscussionChange = (e) => {
    const { name, value } = e.target;
    setEditDiscussion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const closeEditDiscussionModal = () => {
    setEditDiscussionModalOpen(false);
  };

  return (
  <div className="mb-4" style={{ width: '65%' }}> {/* širinu ovdje podesiti 65% */}
    <div className="shadow-sm p-3 mb-4 rounded bg-white">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
              style={{ width: '50px', height: '50px', color: 'white', fontSize: '1.2rem' }}
            >
              <i className="fa fa-user"></i>
            </div>
            <div className="ms-3">
              <h6 className="mb-0">{discussion.name} {discussion.surname}</h6>
              <small className="text-muted">@{discussion.username}</small>
            </div>
          </div>
          <div>
          {discussion.username === loggedUser && (
          <button
            className="btn p-0 mx-1" 
            onClick={handleUserDiscussionEdit}
            style={{
              background: 'none',
              border: 'none', 
              color: '#6c757d', 
              fontSize: '1.2em', 
              cursor: 'pointer', 
              transition: 'color 0.2s', 
            }}
            onMouseEnter={(e) => (e.target.style.color = '#007bff')} 
            onMouseLeave={(e) => (e.target.style.color = '#6c757d')} 
          >
            <i className="fa fa-pencil"></i>
          </button>
        )}
        {(discussion.username === loggedUser || Number(role) === 1) && (
          <button
            className="btn p-0 mx-1" 
            onClick={handleDeleteDiscussion}
            style={{
              background: 'none', 
              border: 'none', 
              color: '#dc3545', 
              fontSize: '1.2em', 
              cursor: 'pointer',
              transition: 'color 0.2s', 
            }}
            onMouseEnter={(e) => (e.target.style.color = '#ff6666')} 
            onMouseLeave={(e) => (e.target.style.color = '#dc3545')} 
          >
            <i className="fa fa-trash"></i>
          </button>
        )}
          </div>
        </div>

        {/* Siva linija - kao granica za preglednost */}
        <hr style={{ border: '1px solid #dee2e6', margin: '1rem 0' }} />

        {/* Content */}
        <div className="mt-3">
          <p className="mb-2">{discussion.content}</p>
          <h6 className="text-primary mb-1">#{discussion.theme_name}</h6>
          <small className="text-muted">{discussion.post_time}</small>
        </div>

        {/* siva linija*/}
        <hr style={{ border: '1px solid #dee2e6', margin: '1rem 0' }} />

        {/* Actions */}
        <div className="mt-3">
          <DiscussionAction 
            discussion={discussion} 
            userId={userId}
            role={role}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditDiscussionModalOpen && (
        <div className="modal show d-block" tabIndex="-1" aria-labelledby="editDiscussionModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editDiscussionModalLabel">Edit Discussion</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeEditDiscussionModal}
                ></button>
              </div>

                <div className="modal-body">
                  <form>
                  <div className="mb-3">
                    <label htmlFor="discussionTheme" className="form-label">
                      Select Theme
                    </label>
                    <select
                      id="discussionTheme"
                      name="theme_id" 
                      value={editDiscussion?.theme_id || ''}  
                      onChange={handleInputDiscussionChange}
                      className="form-control"
                    >
                      {themes?.map((theme) => (
                        <option key={theme.id} value={theme.id}>  {/* Use theme_id as value */}
                          {theme.theme_name}  {/* Display theme_name */}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="discussionContent" className="form-label">
                      Discussion Content
                    </label>
                    <textarea
                      id="discussionContent"
                      name="content"
                      value={editDiscussion?.content || ''}
                      onChange={handleInputDiscussionChange}
                      className="form-control"
                      rows="5"
                      placeholder="Enter discussion content"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditDiscussion}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditDiscussionModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionDisplay;

  
