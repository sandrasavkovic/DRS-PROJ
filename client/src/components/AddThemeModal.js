import React, { useState } from "react";
import { addTheme } from "../services/themeService";

const AddThemeModal = ({ isOpen, closeModal, onThemeAdded, checkThemeExists }) => {
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");

  const handleAddTheme = (e) => {
    e.preventDefault();  // ovo sprijeci ponovni submit

    if (!themeName || !themeDescription) {
      alert("You must fill in the theme name and description fields!");
      return;
    }

    const result = checkThemeExists(themeName);

    if (result !== -1) {
      alert("Theme name already exists. Please choose a different name.");
      return;
    }

    const newTheme = { theme_name: themeName, description: themeDescription };
    
    addTheme(newTheme)
      .then((addedTheme) => {
        alert('Theme added successfully.');
        onThemeAdded(addedTheme);
        closeModal();
        // Reset polja za unos
        setThemeName("");
        setThemeDescription("");
      })
      .catch((error) => {
        console.error('Error adding theme:', error);
        alert(`Failed to add theme: ${error}`);
      });
  };

  const handleCloseModal = () => {
    setThemeName("");
    setThemeDescription("");
    closeModal();
  };

  return (
    isOpen && (
    <div className="modal show d-block" tabIndex="-1" aria-labelledby="addThemeModalLabel">
        <div className="modal-dialog modal-dialog-centered">
        
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="addThemeModalLabel">Add Topic</h5>
            </div>
            
            <div className="modal-body">
            <form onSubmit={handleAddTheme}>
              <div className="mb-3">
                <label htmlFor="themeName" className="form-label">
                    Theme name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="themeName"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="Input theme name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="themeDescription" className="form-label">
                    Theme description
                </label>
                <textarea
                    className="form-control"
                    id="themeDescription"
                    rows="4"
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    placeholder="Input theme description"
                />
              </div>
            </form>
            </div>
            <div className="modal-footer d-flex justify-content-between">
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleAddTheme}>
                    Add
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
    )
  );
};

export default AddThemeModal;
