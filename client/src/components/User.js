import React, { useState, useEffect } from 'react';
import '../styles/user.css';
import { fetchThemes } from '../services/themeService';
// socket i handleLogout se prosl kao props, tj to je nesto definisano u visoj komponenti (App.js)
// Kako se var/kod ne bi duplicirao proslijedimo vec postojece

// Primjer kako se koristi socket (nije dio implementacije)!
  // Pogledati kako server odgovara na event klijenta u server.py 
  
  // Dakle u ovom jednostavnom primjeru:
    // korisnik na pritisak dugmeta salje event trigger serveru, 
    // koji odgovara na event
    // korisnik ima listen fju na taj odgovor 
  
    // i na taj nacin zavrsi ciklus event-response-event(listener)

const User = ({ socket, handleLogout }) => {
    const [themes, setThemes] = useState([]); // Lista tema
    const [filteredThemes, setFilteredThemes] = useState([]); // Filtrirane teme
    const [searchTerm, setSearchTerm] = useState(''); // Unos u polje za pretragu
    const [selectedTheme, setSelectedTheme] = useState(null); // Selektovana tema
    const [discussionText, setDiscussionText] = useState(''); // Tekst diskusije

  const handleButtonClick = () => {
    console.log("Button clicked, emitting event to server...");
    socket.emit("button_click"); // Na pritisak dugmeta generisi event (trigger)
  };

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

  useEffect(() => {
    
    console.log(socket);
    if (!socket) return;

    fetchThemes()
    .then((response) => {
      const sortedThemes = response.data.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
      setThemes(sortedThemes);
      setFilteredThemes(sortedThemes);
    })
    .catch((error) => console.error('Error fetching themes:', error));

    //OVO je listener korisnika (na odgovor servera)
    socket.on("serverReaction", (msg) => {
      alert("Poruka primljena od SERVERA: " + msg.message);
      console.log("Poruka primljena od SERVERA: ", msg);
    });

    //OVO jeste dio implementacije (kasnije cemo uraditi)
    socket.on("mention_notification", (msg) => {
      alert(`Spomenuo vas je korisnik: ${msg.message}`);
    });

    // JAKO bitno - sa .off socket otkazuje pretplatu na dogadjaje - po gasenju komponente sve se pretplate trebaju otkazati!
    return () => {
      socket.off("serverReaction");
      socket.off("mention_notification");
    };

  }, [socket]);

  return (
  <div className="page-container">
  {/*<button onClick={handleButtonClick}>Pozdrav</button>  ... Ovo odkomentarisite ako zelite isprobati socket */}
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

  <div className="sidebar-right">
    <div className="discussion-section">
      {selectedTheme ? (
        <h4>Diskusija za temu: {selectedTheme.title}</h4>
      ) : (
        <h4>Izaberite temu za diskusiju</h4>
      )}
    
      <select onChange={handleSelectTheme} value={selectedTheme ? selectedTheme.id : ''}>
        <option value="">Izaberite temu...</option>
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.title}
          </option>
        ))}
      </select>

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
