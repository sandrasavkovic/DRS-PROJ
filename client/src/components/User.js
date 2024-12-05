import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { fetchThemes } from '../services/themeService';

const UserPage = () => {
  const [themes, setThemes] = useState([]); // Lista tema
  const [filteredThemes, setFilteredThemes] = useState([]); // Filtrirane teme
  const [searchTerm, setSearchTerm] = useState(''); // Unos u polje za pretragu
  const [selectedTheme, setSelectedTheme] = useState(null); // Selektovana tema
  const [discussionText, setDiscussionText] = useState(''); // Tekst diskusije

  // Fetch tema od servera
  useEffect(() => {
    fetchThemes()
      .then((response) => {
        const sortedThemes = response.data.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        setThemes(sortedThemes);
        setFilteredThemes(sortedThemes);
      })
      .catch((error) => console.error('Error fetching themes:', error));
  }, []);

  // Rukovanje promenom u polju za pretragu
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = themes.filter((theme) =>
      theme.title.toLowerCase().includes(value)
    );
    setFilteredThemes(filtered);
  };

  // Rukovanje promenom u padajućem meniju za izbor teme
  const handleSelectTheme = (e) => {
    const selectedThemeId = e.target.value;
    const theme = themes.find((t) => t.id === selectedThemeId);
    setSelectedTheme(theme);
  };

  // Rukovanje unosom diskusije
  const handlePublishDiscussion = () => {
    if (!selectedTheme) {
      alert('Molimo izaberite temu pre objave diskusije.');
      return;
    }
    if (discussionText.trim() === '') {
      alert('Tekst diskusije ne može biti prazan.');
      return;
    }

    // Simulacija dodavanja diskusije u selektovanu temu
    console.log(`Diskusija za temu "${selectedTheme.title}":`, discussionText);

    // Resetovanje unosa nakon objave
    setDiscussionText('');
  };

  return (
    <div className="page-container">
      {/* Sidebar za teme (leva strana) */}
      <div className="sidebar-left">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pretraži teme..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="theme-list">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-item ${
                selectedTheme && selectedTheme.id === theme.id ? 'selected' : ''
              }`}
              onClick={() => setSelectedTheme(theme)}
            >
              <h4>{theme.title}</h4>
              <p>{theme.description}</p>
              <small>{new Date(theme.publishedAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar za diskusiju (desna strana) */}
      <div className="sidebar-right">
        <div className="discussion-section">
          {selectedTheme ? (
            <h4>Diskusija za temu: {selectedTheme.title}</h4>
          ) : (
            <h4>Izaberite temu za diskusiju</h4>
          )}

          {/* Padajući meni za izbor teme */}
          <select onChange={handleSelectTheme} value={selectedTheme ? selectedTheme.id : ''}>
            <option value="">Izaberite temu...</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.title}
              </option>
            ))}
          </select>

          {/* Text box za unos diskusije */}
          <textarea
            value={discussionText}
            onChange={(e) => setDiscussionText(e.target.value)}
            placeholder="Unesite svoju diskusiju ovde..."
            rows="5"
          />
          <button onClick={handlePublishDiscussion}>Objavi</button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
