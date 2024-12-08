import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { fetchThemes, fetchDiscussions } from '../services/themeService';

const User = ({ socket, handleLogout }) => {
  const [themes, setThemes] = useState([]); // Lista tema
  const [filteredThemes, setFilteredThemes] = useState([]); // Filtrirane teme
  const [searchTerm, setSearchTerm] = useState(''); // Unos u polje za pretragu
  const [selectedTheme, setSelectedTheme] = useState(null); // Selektovana tema
  const [discussionText, setDiscussionText] = useState(''); // Tekst diskusije
  const [discussions, setDiscussions] = useState([]); // Diskusije za selektovanu temu

  // Rukovanje promenom u polju za pretragu
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = themes.filter((theme) =>
      theme.title.toLowerCase().includes(value)
    );
    setFilteredThemes(filtered);
  };

  // Rukovanje klikom na temu u levom sidebaru
  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    // Dohvatanje diskusija za selektovanu temu
    handleFetchDiscussions(theme.id);
  };

  // Dohvatanje diskusija za selektovanu temu
  const handleFetchDiscussions = (themeId) => {
    fetchDiscussions(themeId) // Pretpostavljam da fetchDiscussions uzima id teme i vraća diskusije
      .then((response) => {
        setDiscussions(response.data); // Stavljanje diskusija u state
      })
      .catch((error) => {
        console.error('Greška pri dohvatiti diskusije:', error);
      });
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

    // Ovde možete dodati socket logiku, ako je potrebno
    return () => {
      socket.off("serverReaction");
      socket.off("mention_notification");
    };
  }, [socket]);

  return (
    <div className="page-container">
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
              onClick={() => handleSelectTheme(theme)} // Dodavanje handlera na klik
            >
              <h4>{theme.id}</h4>
              <p>{theme.theme_name}</p>
              <p>{theme.date_time}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="discussion-list">
      {discussions.length > 0 && (
            <div className="discussions-list">
              <h5>Diskusije:</h5>
              {discussions.map((discussion) => (
                <div key={discussion.id} className="discussion-item">
                  <h6>{discussion.title}</h6>
                  <p>{discussion.content}</p>
                  <small>{discussion.user_id}</small>
                </div>
              ))}
            </div>
          )}
      </div>
      <div className="sidebar-right">
        <div className="discussion-section">
          {selectedTheme ? (
            <h4>Diskusija za temu: {selectedTheme.theme_name}</h4>
          ) : (
            <h4>Izaberite temu za diskusiju</h4>
          )}

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

export default User;
