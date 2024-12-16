import React, { useEffect, useState } from 'react';
import { fetchAllDiscussions } from "../services/discussionService"; 
import 'font-awesome/css/font-awesome.min.css'; // Uključivanje FontAwesome ikona
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; // Tooltip iz React-Bootstrap

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      alert("Prikaz diskusija adminu");
      setIsAdmin(true);
    } else {
      alert("Prikaz diskusija korisniku");
    }

    fetchAllDiscussions()
      .then((response) => {
        const diskusije = response.data;
        console.log(diskusije);
        setDiscussions(diskusije);
      })
      .catch((error) => console.error('Error fetching discussions:', error));
  }, []);

  // Tooltip za dugmadi
  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Diskusije</h2>
      <div className="d-flex flex-column align-items-center">
        {discussions.length > 0 && (
          discussions.map((discussion) => (
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
        )}
      </div>
    </div>
  );
};

export default Discussions;
