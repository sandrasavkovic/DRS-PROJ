import React, { useState, useEffect } from "react";
import { fetchThemes, addTheme } from "../services/themeService";

const AdminThemes = () => {
  const [themes, setThemes] = useState([]);
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");

  const handleAddTheme = () => {
    if (!themeName || !themeDescription) {
      alert("Morate popuniti polja za ime teme i opis!");
      return;
    }

    addTheme({ theme_name: themeName, description: themeDescription })
      .then(() => {
        fetchThemes()
          .then((response) => {
            const sortedThemes = response.data.sort(
              (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
            );
            setThemes(sortedThemes);
            setThemeName(""); // reset theme name field
            setThemeDescription(""); // reset theme description field
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
      <h1 className="mb-4">Teme</h1>

      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Dodajte novu temu</h2>

        <div className="mb-3">
          <label htmlFor="themeName" className="form-label">
            Ime teme
          </label>
          <input
            type="text"
            className="form-control"
            id="themeName"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Unesite ime teme"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="themeDescription" className="form-label">
            Opis teme
          </label>
          <textarea
            className="form-control"
            id="themeDescription"
            rows="4"
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            placeholder="Unesite opis teme"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-info"
            onClick={handleAddTheme}
          >
            Dodaj temu
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClearForm}
          >
            Očistite formu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminThemes;
