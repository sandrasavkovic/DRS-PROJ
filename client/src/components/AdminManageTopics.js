import React, { useState, useEffect } from "react";
import { fetchThemes, deleteTheme, modifyTheme } from "../services/themeService"; 
import 'font-awesome/css/font-awesome.min.css';

const ThemePanel2 = () => {
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [themes, setThemes] = useState([]);

  const handleDeleteTheme = (themeId) => {
    deleteTheme(themeId)
      .then(() => {
        fetchThemes()
          .then((response) => {
            setThemes(response.data);
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error deleting theme:", error));
  };

  const handleModifyTheme = () => {
    if (!themeName || !themeDescription || !selectedThemeId) {
      alert("Please fill in both theme name and description!");
      return;
    }

    const updatedTheme = {
      theme_name: themeName,
      description: themeDescription, 
    };

    modifyTheme(selectedThemeId, updatedTheme)
      .then(() => {
        fetchThemes()
          .then((response) => {
            setThemes(response.data); 
            setThemeName(""); 
            setThemeDescription("");
            setSelectedThemeId(null);
            setIsEditing(false); 
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error modifying theme:", error));
  };

  useEffect(() => {
    fetchThemes()
      .then((response) => {
        setThemes(response.data);
      })
      .catch((error) => console.error("Error fetching themes:", error));
  }, []);

  const handleEditClick = (theme) => {
    setSelectedThemeId(theme.id);
    setThemeName(theme.theme_name);
    setThemeDescription(theme.description);
    setIsEditing(true); 
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setThemeName("");
    setThemeDescription("");
    setSelectedThemeId(null);
  };

  return (
    <div>
      <div className="content">

        {/* Lista tema */}
        {themes.length === 0 ? (
          <p>No themes available.</p>
        ) : (
            <div className="list-group " style={{ width: '80%' }}>
            {themes.map((theme) => (
              <div className="list-group-item d-flex justify-content-between align-items-center" key={theme.id}>
                <div>
                  <h5>{theme.theme_name}</h5>
                  <p>{theme.description}</p>
                </div>
          
                <div className="btn-group">
                <button
                  className="btn p-0 mx-1"
                  onClick={() => handleEditClick(theme)}
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
                <button
                  className="btn p-0 mx-1"
                  onClick={() => handleDeleteTheme(theme.id)}
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
              </div>

              </div>
            ))}
          </div>
          
        )}

        {/* Modal za edit */}
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
