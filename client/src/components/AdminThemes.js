import React, { useState, useEffect } from "react";
import { fetchThemes, addTheme } from "../services/themeService";

const AdminThemes = () => {
  const [themes, setThemes] = useState([]);
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");

  const handleAddTheme = () => {
    if (!themeName || !themeDescription) {
      alert("You must fill in the theme name and description fields!");
      return;
    }

    addTheme({ theme_name: themeName, description: themeDescription })
      .then(() => {
        fetchThemes()
          .then((response) => {
            setThemes(response.data);
            setThemeName("");
            setThemeDescription("");
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error adding theme:", error));
  };

  const handleClearForm = () => {
    setThemeName("");
    setThemeDescription("");
  };

  return (
    <div className="container mt-4">

      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Add new theme</h2>

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

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-info"
            onClick={handleAddTheme}
          >
            Add theme
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClearForm}
          >
            Clean form
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminThemes;
