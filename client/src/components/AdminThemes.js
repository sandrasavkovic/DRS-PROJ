import React, { useState, useEffect } from "react";
import { fetchThemes, addTheme, deleteTheme, modifyTheme } from "../services/themeService"; 

const ThemePanel = () => {
  const [themes, setThemes] = useState([]);
  const [themeName, setThemeName] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 

  // NAPOMENA: kod svakog dodavanja, brisanja i modifikovanja se ponovo poziva fetch (ažuriranje)
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
            setThemeName(""); // reset polja za unos
            setThemeDescription(""); // reset polja za opis
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error adding theme:", error));
  };

  const handleDeleteTheme = (themeId) => {
    deleteTheme(themeId)
      .then(() => {
        fetchThemes()
    .then((response) => {
      const sortedThemes = response.data.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
            setThemes(sortedThemes);
          })
          .catch((error) => console.error("Error fetching themes:", error));
      })
      .catch((error) => console.error("Error deleting theme:", error));
  };

  const handleModifyTheme = () => {
    if (!themeName || !themeDescription || !selectedThemeId) {
      alert("Morate popuniti ime teme, opis i odabrati temu za modifikaciju!");
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
            setThemes(sortedThemes); 
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
      const sortedThemes = response.data.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
      console.log(sortedThemes)
      setThemes(sortedThemes);
    })
    .catch((error) => console.error('Error fetching themes:', error));

  }, []);

  const handleEditClick = (theme) => {
    setSelectedThemeId(theme.id);
    setThemeName(theme.theme_name);
    setThemeDescription(theme.description);
    setIsEditing(true); 
  };

  return (
    <div className="admin-page">

      <div className="content">
        <h1>Teme</h1>

        {/* Dodavanje nove teme */}
        <button onClick={() => { setIsEditing(false); setThemeName(""); setThemeDescription(""); }}>
          Dodaj novu temu
        </button>

        {/* Forma za dodavanje i modifikovanje teme */}
        <div>
          <h2>{isEditing ? "Modifikujte temu" : "Dodajte novu temu"}</h2>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Unesite ime teme"
          />
          <textarea
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            placeholder="Unesite opis teme"
          />
          <button onClick={isEditing ? handleModifyTheme : handleAddTheme}>
            {isEditing ? "Modifikuj temu" : "Dodaj temu"}
          </button>
        </div>

        {/* Lista svih tema */}
        <h2>Lista Tema</h2>
        {themes.length === 0 ? (
          <p>No themes available.</p>
        ) : (
          <ul>
            {themes.map((theme) => (
              <li key={theme.id}>
                <span>{theme.theme_name}</span>
                <span>{theme.description}</span>
                <span>{theme.date_time}</span>
                <button onClick={() => handleEditClick(theme)}>Modify</button>
                <button onClick={() => handleDeleteTheme(theme.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ThemePanel;
