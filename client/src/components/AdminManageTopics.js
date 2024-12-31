import React, { useState, useEffect } from "react";
import { fetchThemes, deleteTheme, modifyTheme } from "../services/themeService"; 

const ThemePanel2 = () => {
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [themes, setThemes] = useState([]);

  // Handle theme deletion
  const handleDeleteTheme = (themeId) => {
    deleteTheme(themeId)
      .then(() => {
        fetchThemes()
          .then((response) => {
            const sortedThemes = response.data.sort(
              (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
            );
            setThemes(sortedThemes); // Update the theme list
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error deleting theme:", error));
  };

  // Handle theme modification
  const handleModifyTheme = () => {
    if (!themeName || !themeDescription || !selectedThemeId) {
      alert("Please fill in both theme name and description!");
      return;
    }

    const updatedTheme = {
      theme_name: themeName,
      description: themeDescription, 
      date_time: new Date().toISOString(),
    };

    modifyTheme(selectedThemeId, updatedTheme)
      .then(() => {
        fetchThemes()
          .then((response) => {
            const sortedThemes = response.data.sort(
              (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
            );
            setThemes(sortedThemes); // Update state with the new list of themes
            setThemeName(""); // Reset the input fields
            setThemeDescription("");
            setSelectedThemeId(null);
            setIsEditing(false); // Close the modal after saving changes
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error modifying theme:", error));
  };

  // Fetch themes on initial render
  useEffect(() => {
    fetchThemes()
      .then((response) => {
        const sortedThemes = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setThemes(sortedThemes); // Set initial theme list
      })
      .catch((error) => console.error("Error fetching themes:", error));
  }, []);

  // Handle edit button click
  const handleEditClick = (theme) => {
    setSelectedThemeId(theme.id);
    setThemeName(theme.theme_name);
    setThemeDescription(theme.description);
    setIsEditing(true); // Show the modal when editing
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsEditing(false);
    setThemeName("");
    setThemeDescription("");
    setSelectedThemeId(null);
  };

  return (
    <div className="admin-page">
      <div className="content">

        {/* List of all themes */}
        {themes.length === 0 ? (
          <p>No themes available.</p>
        ) : (
            <div className="list-group ">
            {themes.map((theme) => (
              <div className="list-group-item d-flex justify-content-between align-items-center" key={theme.id}>
                <div>
                  <h5>{theme.theme_name}</h5>
                  <p>{theme.description}</p>
                  <small className="text-muted">{new Date(theme.date_time).toLocaleString()}</small>
                </div>
          
                <div className="btn-group">
                  <button
                    onClick={() => handleEditClick(theme)}
                    className="btn btn-info"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTheme(theme.id)}
                    className="btn btn-secondary"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
        )}

        {/* Modal for Editing Theme */}
        {isEditing && (
          <div className="modal show d-block" tabIndex="-1" aria-labelledby="editThemeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editThemeModalLabel">Edit Theme</h5>
                 
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="themeName" className="form-label">Theme Name</label>
                      <input
                        type="text"
                        id="themeName"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}
                        className="form-control"
                        placeholder="Enter theme name"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="themeDescription" className="form-label">Theme Description</label>
                      <textarea
                        id="themeDescription"
                        value={themeDescription}
                        onChange={(e) => setThemeDescription(e.target.value)}
                        className="form-control"
                        placeholder="Enter theme description"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModifyTheme}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemePanel2;
