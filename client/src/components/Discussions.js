import React, { useEffect, useState } from 'react';
import { fetchAllDiscussions } from "../services/discussionService"; 
import 'font-awesome/css/font-awesome.min.css'; // Uključivanje FontAwesome ikona
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; // Tooltip iz React-Bootstrap

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [filters, setFilters] = useState({
    searchBy: 'theme_name',  // Default filter: 'theme_name'
    searchValue: '',
  });

  useEffect(() => {
    fetchAllDiscussions()
      .then((response) => {
        const diskusije = response.data;
        console.log(diskusije);
        setDiscussions(diskusije);
      })
      .catch((error) => console.error('Error fetching discussions:', error));
  }, []);

  // Filter diskusija na osnovu vrednosti pretrage
  const filteredDiscussions = discussions.filter(discussion => {
    const searchValueLower = filters.searchValue.toLowerCase();

    let matchesSearch = false;
    if (filters.searchBy === 'theme_name') {
      matchesSearch = discussion.theme_name.toLowerCase().includes(searchValueLower);
    } else if (filters.searchBy === 'name') {
      matchesSearch = discussion.name.toLowerCase().includes(searchValueLower);
    } else if (filters.searchBy === 'surname' && discussion.surname) {
      matchesSearch = discussion.surname.toLowerCase().includes(searchValueLower);
    } else if (filters.searchBy === 'email' && discussion.email) {
      matchesSearch = discussion.email.toLowerCase().includes(searchValueLower);
    }

    return matchesSearch;
  });

  // Funkcija za update filtera
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funkcija za promenu vrste pretrage (radio dugmadi)
  const handleRadioChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      searchBy: e.target.value,
      searchValue: '', // resetujemo vrednost kada se promeni kriterijum
    }));
  };

  // Tooltip za buttons
  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Diskusije</h2>

      {/* Pretraga */}
      <div className="d-flex justify-content-center mb-4">
        <div className="form-group mx-2">
          <div className="btn-group" role="group" aria-label="Search by">
            <label className="btn btn-outline-primary">
              <input
                type="radio"
                name="searchBy"
                value="theme_name"
                checked={filters.searchBy === 'theme_name'}
                onChange={handleRadioChange}
              />
              Tema
            </label>
            <label className="btn btn-outline-primary">
              <input
                type="radio"
                name="searchBy"
                value="name"
                checked={filters.searchBy === 'name'}
                onChange={handleRadioChange}
              />
              Ime korisnika
            </label>
            <label className="btn btn-outline-primary">
              <input
                type="radio"
                name="searchBy"
                value="surname"
                checked={filters.searchBy === 'surname'}
                onChange={handleRadioChange}
              />
              Prezime korisnika
            </label>
            <label className="btn btn-outline-primary">
              <input
                type="radio"
                name="searchBy"
                value="email"
                checked={filters.searchBy === 'email'}
                onChange={handleRadioChange}
              />
              Email korisnika
            </label>
          </div>
        </div>

        {/* Input polje za unos vrednosti pretrage */}
        <div className="form-group mx-2" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            name="searchValue"
            value={filters.searchValue}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Unesite tekst za pretragu..."
          />
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <div key={discussion.id} className="mb-4 w-75">
              <div className="card shadow-sm" style={{ border: 'none' }}>
                {/* Header: User ID */}
                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f7f7f7', border: 'none' }}>
                  <small className="text-muted">Username: {discussion.username}</small>
                  <small className="text-muted">Tema: {discussion.theme_name}</small>
                </div>

                {/* Naslov diskusije */}
                <div className="card-body">
                  <h5 className="card-title font-weight-bold" style={{ fontSize: '1.25rem' }}>{discussion.title}</h5>
                </div>

                {/* Sadržaj diskusije sa skrol barom */}
                <div className="card-body" style={{ maxHeight: '150px', overflowY: 'auto', padding: '0.75rem' }}>
                  <p className="card-text">{discussion.content}</p>
                </div>

                {/* Dugmadi: Like, Dislike, Komentari */}
                <div className="card-footer text-muted d-flex justify-content-start align-items-center" style={{ backgroundColor: '#f7f7f7', borderTop: '1px solid #e6e6e6' }}>
                  {/* Like dugme */}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => renderTooltip(props, 'Like')}
                  >
                    <button className="btn btn-outline-success btn-sm mx-1" style={{ width: '30px', height: '30px' }}>
                      <i className="fa fa-thumbs-up"></i>
                    </button>
                  </OverlayTrigger>

                  {/* Dislike dugme */}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => renderTooltip(props, 'Dislike')}
                  >
                    <button className="btn btn-outline-danger btn-sm mx-1" style={{ width: '30px', height: '30px' }}>
                      <i className="fa fa-thumbs-down"></i>
                    </button>
                  </OverlayTrigger>

                  {/* Komentari dugme */}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => renderTooltip(props, 'Komentari')}
                  >
                    <button className="btn btn-outline-primary btn-sm mx-1" style={{ width: '30px', height: '30px' }} data-toggle="collapse" data-target={`#comments-${discussion.id}`}>
                      <i className="fa fa-comment"></i>
                    </button>
                  </OverlayTrigger>
                </div>

                {/* Mesto za komentare */}
                <div id={`comments-${discussion.id}`} className="collapse mt-3">
                  <div className="card-body">
                    <textarea className="form-control" rows="3" placeholder="Napišite komentar..."></textarea>
                  </div>
                </div>
              </div>
              {/* Razdvajanje diskusija sa svetlom sivom linijom */}
              <hr style={{ borderTop: '1px solid #e6e6e6' }} />
            </div>
          ))
        ) : (
          <p>No discussions found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Discussions;
