import React, { useState, useEffect } from 'react';
import {
  reactToDiscussion,
  fetchDiscussionReactions,
  fetchDiscussionComments,
  postComment,
  getUserIdByUsername,
  deleteComment
} from '../services/discussionService';
import 'font-awesome/css/font-awesome.min.css';

const DiscussionAction = ({ discussionId, userId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState('none');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);

  // Fetch logged user ID once when the component mounts
  useEffect(() => {
    getUserIdByUsername(sessionStorage.getItem("user_name"))
      .then((id) => {
        setLoggedUserId(id); // Set the logged-in user ID
      })
      .catch((error) => console.error('Error fetching user ID:', error));

    fetchDiscussionReactions(discussionId, userId)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
        console.log(data.user_reaction);
        setUserReaction(data.user_reaction); // Postavljanje početne reakcije
      })
      .catch((error) => console.error('Error fetching reactions:', error));
  }, [discussionId, userId]);

  const handleReaction = (reactionType) => {
    if (userId) {
      reactToDiscussion(discussionId, userId, reactionType)
        .then((data) => {
          setLikesCount(data.likes);
          setDislikesCount(data.dislikes);
          setUserReaction(data.user_reaction); // Ažuriraj reakciju korisnika nakon promene
        })
        .catch((error) => {
          console.error(`Error reacting to discussion: ${reactionType}`, error);
          alert(`Failed to ${reactionType} discussion.`);
        });
    } else {
      console.error('User ID is not available');
      alert('User ID is not available');
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      fetchDiscussionComments(discussionId)
        .then((data) => {
          setComments(data); // Use the data directly, which already contains the username
        })
        .catch((error) => console.error('Error fetching comments:', error));
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    postComment(discussionId, loggedUserId, newComment)
      .then((data) => {
        setComments((prev) => [...prev, data]);
        setNewComment('');
      })
      .catch((error) => console.error('Error posting comment:', error));
  };

  // Function to check if the logged-in user can delete a comment
  const canDeleteComment = (commentUserId) => {
    return loggedUserId === commentUserId || loggedUserId === userId;
  };

  // Function to handle deleting a comment
  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      // Call the service to delete the comment (you need to implement this in your service)
      // deleteComment(discussionId, commentId)
      deleteComment(commentId)
      //   .then(() => {
      //     setComments(comments.filter((comment) => comment.id !== commentId));
      //   })
      //   .catch((error) => console.error('Error deleting comment:', error));
      console.log(`Deleted comment with ID: ${commentId}`);
    }
  };

  return (
    <div>
      {/* Reaction Buttons */}
      {/* Like dugme */}
      <button
        onClick={() => handleReaction('like')}
        className="btn border-0 p-0 mx-2" // Uklonjen okvir i razmak
        style={{
          fontSize: userReaction === 'like' ? '1.8em' : '1.5em', // Veća ikonica ako je aktivna
          color: userReaction === 'like' ? '#007bff' : '#6c757d', // Plava ako je aktivna, siva inače
          transition: 'font-size 0.2s, color 0.2s', // Animacija prelaza
        }}
      >
        <i className="fa fa-thumbs-up"></i>
      </button>
      <span>{likesCount}</span>

      {/* Dislike dugme */}
      <button
        onClick={() => handleReaction('dislike')}
        className="btn border-0 p-0 mx-2" // Uklonjen okvir i razmak
        style={{
          fontSize: userReaction === 'dislike' ? '1.8em' : '1.5em', // Veća ikonica ako je aktivna
          color: userReaction === 'dislike' ? '#dc3545' : '#6c757d', // Crvena ako je aktivna, siva inače
          transition: 'font-size 0.2s, color 0.2s', // Animacija prelaza
        }}
      >
        <i className="fa fa-thumbs-down"></i>
      </button>
      <span>{dislikesCount}</span>
      
      <button
        onClick={toggleComments}
        className="btn btn-sm btn-outline-secondary"
      >
        Comments
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 p-2 border rounded bg-light">
          <h6>Comments</h6>
          {console.log("OVO je LOGOVANI ID : " , loggedUserId)}
          {console.log("OVO je ID  KORISNIKA KOJI JE KREIRAO DISKUSIJU", userId)}
          {comments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <small className="text-muted">
                {comment.username} | {new Date(comment.datetime).toLocaleString()}
              </small>
              <p>{comment.content}</p>
              {console.log("OVO je ID KORISNIKA KOD KOMENTARA : " , comment.user_id)}

              {/* Show delete button based on the logic */}
              {(loggedUserId === userId || loggedUserId === comment.user_id) && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <i className="fa fa-trash"></i> Delete
                </button>
              )}
            </div>
          ))}

          <div className="input-group mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionAction;
