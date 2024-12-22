import React, { useState, useEffect } from 'react';
import { updateDiscussion, getDiscussionById, deleteDiscussion, fetchDiscussions } from '../services/themeService';
import { modifyDiscussion, fetchAllDiscussions } from '../services/discussionService';
import 'font-awesome/css/font-awesome.min.css';
import DiscussionAction from './DiscussionAction'; 

// Ovdje se definise izgled pojedinacne diskusije, handle edit, delete

const DiscussionDisplay = ({ discussion, userId }) => {
  const [isEditDiscussionModalOpen, setEditDiscussionModalOpen] = useState(false);
  const [editDiscussion, setEditDiscussion] = useState(null);

  const [DiscussionName, setDiscussionName] = useState("");
  const [DiscussionDescription, setDiscussionDescription] = useState("");
  const [discussion2, setDiscussion] = useState([]);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);


  const loggedUser = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("isAdmin");

  useEffect(() => {
    console.log("diskusija se mijenja mora u uglaste zagrade")
  }, [discussion]);


 // Handle discussion modification
 const handleModifyDiscussion = () => {
  if (!DiscussionName || !DiscussionDescription || !selectedDiscussionId) {
    alert("Please fill in both theme name and description!");
    return;
  }

  const updatedDiscussion = {
    title: DiscussionName,
    content: DiscussionDescription, 
    datetime: new Date().toISOString(),
  };

  modifyDiscussion(selectedDiscussionId, updatedDiscussion)
    .then(() => {
      fetchAllDiscussions()
        .then((response) => {
          const sortedDiscussion = response.data.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          );
          setDiscussion(sortedDiscussion); // Update state with the new list of discussions
          setDiscussionName(""); // Reset the input fields
          setDiscussionDescription("");
          setSelectedDiscussionId(null);
          setEditDiscussionModalOpen(false); // Close the modal after saving changes
        })
        .catch((error) => console.error("Error fetching discussions:", error));
    })
    .catch((error) => console.error("Error modifying discussions:", error));
};


 // Fetch discussions on initial render
 useEffect(() => {
  fetchAllDiscussions()
    .then((response) => {
      const sortedDiscussion = response.data.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
      setDiscussion(sortedDiscussion); // Set initial theme list
    })
    .catch((error) => console.error("Error fetching discussions:", error));
}, []);


 // Handle edit button click
 const handleEditClick = (discussion) => {
  setSelectedDiscussionId(discussion.id);
  setDiscussionName(discussion.title);
  setDiscussionDescription(discussion.content);
  setEditDiscussionModalOpen(true); // Show the modal when editing
};

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
    setDiscussionName("");
    setDiscussionDescription("");
    setSelectedDiscussionId(null);
  };

  return (
    <div className="mb-4 w-75">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between">
          <small className="text-muted">Username: {discussion.username}</small>
          <small className="text-muted">Tema: {discussion.theme_name}</small>
        </div>
        <div className="card-body">
          <h5 className="card-title">{discussion.title}</h5>
          <small className="card-title">Sadržaj: {discussion.content}</small>
        </div>
        <div className="card-footer d-flex justify-content-between">
          {/* Displaying DiscussionAction component */}
          <DiscussionAction 
            discussion={discussion} 
            userId={userId}
            role={role}
          />
          <div>
            {discussion.username === loggedUser && (
              <button
                className="btn btn-outline-secondary btn-sm mx-1"
                onClick={() => handleEditClick(discussion)}
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
        <div className="modal show d-block" tabIndex="-1" aria-labelledby="editDiscussionModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="editDiscussionModalLabel">Edit discussion</h5>  
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="DiscussionName" className="form-label">Discussion title</label>
                    <input
                        type="text"
                        id="DiscussionName"
                        value={DiscussionName}
                        onChange={(e) => setDiscussionName(e.target.value)}
                        className="form-control"
                        placeholder="Enter discussion name"
                      />
                </div>
                <div className="mb-3">
                      <label htmlFor="DiscussionDescription" className="form-label">Discussion description</label>
                      <textarea
                        id="DiscussionDescription"
                        value={DiscussionDescription}
                        onChange={(e) => setDiscussionDescription(e.target.value)}
                        className="form-control"
                        placeholder="Enter discussion description"
                      />
                </div>
              </form>
            </div>
            <div className="modal-footer">
                  
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModifyDiscussion}
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
