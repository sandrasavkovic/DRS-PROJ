import React, { useState, useEffect } from "react";
import AddThemeModal from './AddThemeModal';
import { deleteTheme, modifyTheme } from "../services/themeService"; 
import 'font-awesome/css/font-awesome.min.css';

const AdminCRUD = ({ themes:propThemes, isLoading }) => {
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [themes, setThemes] = useState([]);
  
  const [isAddThemeModalOpen, setAddThemeModalOpen] = useState(false); // Za dodavanje teme

 
  useEffect(() => {
    setThemes(propThemes);
  }, [propThemes]);
  
  //BRISANJE TEME
  const handleDeleteTheme = (themeId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      deleteTheme(themeId)
      .then(() => {
        setThemes((prevThemes) =>
          prevThemes.filter((theme) => theme.id !== themeId)
        );
      })
      .catch((error) => console.error("Error deleting theme:", error));
    }
  };

  //IZMJENA TEME
  const handleModifyTheme = () => {
    if (!themeName || !themeDescription || !selectedThemeId) {
      alert("Please fill in both theme name and description!");
      return;
    }

    const result = checkThemeExists(themeName);

    if (result !== -1) {
      if(result !== selectedThemeId){
        alert("Theme name already exists. Please choose a different name.");
        return;
      }
    }
  
    const updatedTheme = {
      theme_name: themeName,
      description: themeDescription,
    };
  
    modifyTheme(selectedThemeId, updatedTheme)
      .then(() => {
        setThemes((prevThemes) =>
          prevThemes.map((theme) =>
            theme.id === selectedThemeId ? { ...theme, ...updatedTheme } : theme
          )
        );
  
        // Reset polja za unos
        setThemeName("");
        setThemeDescription("");
        setSelectedThemeId(null);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error modifiying theme:', error);
        alert(`Failed to modify theme: ${error}`);
      });
  };

  //DODAVANJE NOVE TEME
  const openAddThemeModal = () => {
    setAddThemeModalOpen(true);
  };

  const closeAddThemeModal = () => {
    setAddThemeModalOpen(false);
  };

  const checkThemeExists = (themeName) => {
    const foundTheme = themes.find((theme) => theme.theme_name === themeName);
    return foundTheme ? foundTheme.id : -1;
  };

  const handleThemeAdded = (newTheme) => {
    setThemes((prevThemes) => [newTheme, ...prevThemes]);
  };

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
    <div className="container mt-4">
    
     <div className="row justify-content-center mb-3">
      <div className="col-10 d-flex justify-content-end">
        <button
          className="btn btn-outline-secondary"
          onClick={openAddThemeModal}
          style={{ margin: '1rem' }}>

          <i className="fa fa-plus" style={{ marginRight: '0.5rem' }}></i> {/* Plus ikona */}
          Add Topic
        </button>
      </div>
    </div>
  
      <AddThemeModal
        isOpen={isAddThemeModalOpen}
        closeModal={closeAddThemeModal}
        onThemeAdded={handleThemeAdded}
        checkThemeExists={checkThemeExists} 
      />
  
      {/* Lista tema */}
       {isLoading ? (
        <div className="d-flex justify-content-center align-items-start" style={{ height: "100vh" }}>
          <p>Loading themes...</p>
        </div>
      ) : themes.length === 0 ? (
        <div className="d-flex justify-content-center align-items-start" style={{ height: '100vh' }}>
        <p>No themes available.</p>
      </div>
      ) : (
        <div className="list-group mx-auto" style={{ width: '80%' }}>
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
                  onMouseLeave={(e) => (e.target.style.color = '#6c757d')}>
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
                  onMouseLeave={(e) => (e.target.style.color = '#dc3545')}>
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* Modal za edit */}
      {isEditing && (
        <div className="modal show d-block" tabIndex="-1" aria-labelledby="editThemeModalLabel">
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
                  onClick={handleModifyTheme}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}>
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

export default AdminCRUD;
