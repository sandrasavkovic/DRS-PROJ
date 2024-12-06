import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./AdminSidebar";
import "../styles/Admin.css";
import axios from "axios";

const Admin = ({ socket, handleLogout }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState([]); // Dodano za teme
  const [selectedTopic, setSelectedTopic] = useState("");
  const [newTopicId, setNewTopicId] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [action, setAction] = useState(""); // Za praćenje akcije (izmena/brisanje)
  const [selectedSection, setSelectedSection] = useState(""); // Za odabir sekcije iz sidebar-a

  // Stati za dodavanje diskusije
  const [discussionId, setDiscussionId] = useState("");
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [discussionUserId, setDiscussionUserId] = useState("");


  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [updatedDiscussion, setUpdatedDiscussion] = useState({
    id: "",
    title: "",
    content: "",
  });

  const handleAcceptRequest = (userId) => {
    console.log("Accepting request for user: " + userId);
    //socket.emit("accept_request", { userId }); //necemo ovdje emitovati EVENT (saljemo HTTP)
    fetch(`/approving/accept-request/${userId}`, { method: "PUT" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Request accepted:", data);
      })
      .catch((error) => console.error("Error accepting request:", error));
  };

  const handleRejectRequest = (userId) => {
    console.log("Rejecting request for user: " + userId);
    //socket.emit("reject_request", { userId }); //necemo ovdje emitovati EVENT (saljemo HTTP)
    fetch(`/approving/decline-request/${userId}`, { method: "PUT" })
    .then((response) => response.json())
    .then((data) => {
      console.log("Request declined:", data);
    })
    .catch((error) => console.error("Error declining request:", error));
  };

  const handleSelect = (option) => {
    setSelected(option);
  };

  
  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-topic", {
        id: id,
        name: name,
      });
      setMessage("Tema je uspešno dodata!");
      setId(""); // Resetovanje form fields
      setName("");
    } catch (error) {
      console.error("Greška pri dodavanju teme", error);
      setMessage("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  // Brisanje teme
  const handleDeleteTopic = () => {
    if (selectedTopic) {
      fetch(`/topics/delete/${selectedTopic}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => {
          alert("Tema je obrisana!");
          setTopics(topics.filter((topic) => topic.id !== selectedTopic));
        })
        .catch((error) => console.error("Error deleting topic:", error));
    }
  };

  const handleUpdateTopic = () => {
    if (newTopicId && newTopicName && selectedTopic) {
      fetch(`/topics/update/${selectedTopic}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newTopicId, name: newTopicName }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Tema je uspešno izmenjena!");
          setTopics(
            topics.map((topic) =>
              topic.id === selectedTopic
                ? { ...topic, id: newTopicId, name: newTopicName }
                : topic
            )
          );
        })
        .catch((error) => console.error("Error updating topic:", error));
    }
  };

  const renderManageTopicsForm = () => {
    return (
      <div className="manage-topic-form">
        <h2>Manage Topic</h2>
        <div>
          <label>Select Topic</label>
          <select
            onChange={(e) => setSelectedTopic(e.target.value)}
            value={selectedTopic}
          >
            <option value="">--Select a topic--</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTopic && (
          <div>
            <button onClick={() => setAction("delete")}>Delete Topic</button>
            <button onClick={() => setAction("edit")}>Edit Topic</button>
          </div>
        )}

        {action === "delete" && (
          <div>
            <button onClick={handleDeleteTopic}>Confirm Delete</button>
          </div>
        )}

        {action === "edit" && (
          <div className="edit-topic-form">
            <div>
              <label>New Topic ID</label>
              <input
                type="text"
                value={newTopicId}
                onChange={(e) => setNewTopicId(e.target.value)}
              />
            </div>
            <div>
              <label>New Topic Name</label>
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
              />
            </div>
            <button onClick={handleUpdateTopic}>Save Changes</button>
          </div>
        )}
      </div>
    );
  };

  const handleAddDiscussion = () => {
    const newDiscussion = {
      id: discussionId,
      title: discussionTitle,
      content: discussionContent,
      user_id: discussionUserId,
    };

    axios
      .post("/discussions", newDiscussion)
      .then((response) => {
        alert("Diskusija je uspešno kreirana!");
        // Očisti formu
        setDiscussionId("");
        setDiscussionTitle("");
        setDiscussionContent("");
        setDiscussionUserId("");
      })
      .catch((error) => console.error("Error adding discussion:", error));
  };

  // Funkcija za prikaz forme za dodavanje diskusije
  const renderAddDiscussionForm = () => {
    return (
      <div className="add-discussion-form">
        <h2>Add Discussion</h2>
        <div>
          <label>Discussion ID</label>
          <input
            type="number"
            value={discussionId}
            onChange={(e) => setDiscussionId(e.target.value)}
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={discussionTitle}
            onChange={(e) => setDiscussionTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={discussionContent}
            onChange={(e) => setDiscussionContent(e.target.value)}
          />
        </div>
        <div>
          <label>User ID</label>
          <input
            type="number"
            value={discussionUserId}
            onChange={(e) => setDiscussionUserId(e.target.value)}
          />
        </div>
        <button onClick={handleAddDiscussion}>Add Discussion</button>
      </div>
    );
  };


  const handleSelectDiscussion = (discussionId) => {
    const discussion = discussions.find((d) => d.id === discussionId);
    setSelectedDiscussion(discussion);
    setUpdatedDiscussion({
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
    });
  };

  // Funkcija za brisanje diskusije
  const handleDeleteDiscussion = () => {
    fetch(`/discussions/${updatedDiscussion.id}`, {
      method: "DELETE",
    })
      .then(() => {
        console.log("Discussion deleted");
        setDiscussions(discussions.filter((d) => d.id !== updatedDiscussion.id));
        setSelectedDiscussion(null); // Resetovanje selektovane diskusije
      })
      .catch((error) => console.error("Error deleting discussion:", error));
  };

 // Funkcija za izmenu diskusije
 const handleUpdateDiscussion = () => {
  fetch(`/discussions/${updatedDiscussion.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedDiscussion),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Discussion updated:", data);
      setDiscussions(
        discussions.map((d) =>
          d.id === updatedDiscussion.id ? updatedDiscussion : d
        )
      );
      setSelectedDiscussion(null); // Resetovanje selektovane diskusije
    })
    .catch((error) => console.error("Error updating discussion:", error));
};

  // Render funkcija za "Manage Discussion" formu
  const renderManageDiscussionForm = () => {
    return (
      <div className="manage-discussion-form">
        <h2>Manage Discussion</h2>
        <label>Select Discussion</label>
        <select
          value={selectedDiscussion ? selectedDiscussion.id : ""}
          onChange={(e) => handleSelectDiscussion(e.target.value)}
        >
          <option value="">-- Select Discussion --</option>
          {discussions.map((discussion) => (
            <option key={discussion.id} value={discussion.id}>
              {discussion.title}
            </option>
          ))}
        </select>

        {selectedDiscussion && (
          <div className="discussion-details">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={updatedDiscussion.title}
              onChange={(e) =>
                setUpdatedDiscussion({ ...updatedDiscussion, title: e.target.value })
              }
            />
            <label>Content</label>
            <textarea
              name="content"
              value={updatedDiscussion.content}
              onChange={(e) =>
                setUpdatedDiscussion({ ...updatedDiscussion, content: e.target.value })
              }
            />
            <div className="actions">
              <button onClick={handleUpdateDiscussion}>Update</button>
              <button onClick={handleDeleteDiscussion}>Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    console.log(socket);

    if (!socket) return;
     // Učitavanje pending requests na početku
    fetch("/approving/pending-requests") 
      .then((response) => response.json())
      .then((data) => {
        setPendingRequests(data);
      })
      .catch((error) => console.error("Error fetching requests:", error));

      // Učitavanje svih tema
    fetch("/topics")
    .then((response) => response.json())
    .then((data) => setTopics(data))
    .catch((error) => console.error("Error fetching topics:", error));

      fetch("/discussions")
      .then((response) => response.json())
      .then((data) => {
        setDiscussions(data);
      })
      .catch((error) => console.error("Error fetching discussions:", error));


    socket.on("pendingRequestsUpdate", (data) => {
        console.log("Pending requests updated:", data);
        setPendingRequests(data); 
    }
  );

    return () => {
      socket.off("updateRequest");
    };
  }, [socket]);

  return (
    <div className="admin-page">
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
    <Sidebar onSelect={handleSelect} />
    <div className="content">
      <h1>Dobrodošli na Admin stranicu</h1>
      {selected === "addTopic" && (
        <div className="add-topic-form">
          <h2>Dodaj novu temu</h2>
          <form onSubmit={handleAddTopic}>
            <label htmlFor="id">ID Teme:</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <label htmlFor="name">Naziv Teme:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit">Dodaj</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
      {selected === "pendingRequests" && (
        <div>
          <h2>Pending Registration Requests</h2>
          {pendingRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <ul>
              {pendingRequests.map((request) => (
                <li key={request[0]}>
                  <span>
                    {request[3]} {request[4]} ({request[9]})
                  </span>
                  <button onClick={() => handleAcceptRequest(request[0])}>
                    Accept
                  </button>
                  <button onClick={() => handleRejectRequest(request[0])}>
                    Decline
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {selected === "manageTopics" &&  renderManageTopicsForm()}
      {selected === "addDiscussion" && renderAddDiscussionForm()}
      {selected === "manageDiscussion" && renderManageDiscussionForm()}
    </div>
  </div>
);
};

export default Admin;
