import React, { useState, useEffect } from 'react';
import {
  reactToDiscussion,
  fetchDiscussionReactions,
  fetchDiscussionComments,
  postComment,
  deleteComment
} from '../services/discussionService';
import 'font-awesome/css/font-awesome.min.css';

// Ovdje je def like, dislike i kom

const DiscussionAction = ({ discussion, userId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState('none');

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchDiscussionReactions(discussion.id, userId)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
        setUserReaction(data.user_reaction);
      })
      .catch((error) => console.error('Error fetching reactions:', error));

    fetchDiscussionComments(discussion.id)
      .then((data) => {
        setComments(data);
      })
      .catch((error) => console.error('Error fetching comments:', error));

  }, [discussion]);

  const handleReaction = (reactionType) => {
    if (userId) {
      reactToDiscussion(discussion.id, userId, reactionType)
        .then((data) => {
          setLikesCount(data.likes);
          setDislikesCount(data.dislikes);
          setUserReaction(data.user_reaction);
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
      fetchDiscussionComments(discussion.id)
        .then((data) => {
          setComments(data);
        })
        .catch((error) => console.error('Error fetching comments:', error));
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }
  
    // Detect mentions using regex (e.g., @username)
    const mentionPattern = /@(\w+)/g;
    const mentions = [...newComment.matchAll(mentionPattern)].map(match => match[1]);
  
    postComment(discussion.id, userId, newComment, mentions)
      .then((data) => {
        setComments((prev) => [...prev, data]);
        setNewComment('');
      })
      .catch((error) => console.error('Error posting comment:', error));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId)
        .then(() => {
          // Ukloni obrisani komentar iz lokalnog stanja
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
          console.log(`Deleted comment with ID: ${commentId}`);
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
          alert('Failed to delete comment.');
        });
    }
  };

  return (
    <div>
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
        }}>
        <i className="fa fa-thumbs-down"></i>
      </button>
      <span>{dislikesCount}</span>
      
      <button
        onClick={toggleComments}
        className="btn btn-sm btn-outline-secondary">
        Comments
      </button>

      {showComments && (
        <div className="mt-3 p-2 border rounded bg-light">
          <h6>Comments</h6>
          {comments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <small className="text-muted">
                {comment.username} | {new Date(comment.datetime).toLocaleString()}
              </small>
              <p>{comment.content}</p>
            
              {/* Ako je korisnikova diskusija ili ako je njegov komentar */}
              {( discussion.user_id === userId || userId === comment.user_id) && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteComment(comment.id)}>
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
              className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionAction;
