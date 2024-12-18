import React, { useState, useEffect } from 'react';
import {
  reactToDiscussion,
  fetchDiscussionReactions,
  fetchDiscussionComments,
  postComment,
} from '../services/discussionService';
import 'font-awesome/css/font-awesome.min.css';

const DiscussionAction = ({ discussionId, userId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState('none');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchDiscussionReactions(discussionId, userId)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
        setUserReaction(data.user_reaction);
      })
      .catch((error) => console.error('Error fetching reactions:', error));
  }, [discussionId, userId]);

  const handleReaction = (reactionType) => {
    const newReaction = reactionType === userReaction ? 'none' : reactionType;

    reactToDiscussion(discussionId, userId, newReaction)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
        setUserReaction(data.user_reaction);
      })
      .catch((error) => console.error(`Error reacting to discussion: ${reactionType}`, error));
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      fetchDiscussionComments(discussionId)
        .then((data) => {
          // Use the data directly, which already contains the username
          setComments(data); // No need to map or format the comments anymore
        })
        .catch((error) => console.error('Error fetching comments:', error));
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    postComment(discussionId, userId, newComment)
      .then((data) => {
        // Assuming the returned data contains a similar structure as the comment data
        setComments((prev) => [...prev, data]);
        setNewComment('');
      })
      .catch((error) => console.error('Error posting comment:', error));
  };

  return (
    <div>
      {/* Reaction Buttons */}
      <button
        onClick={() => handleReaction('like')}
        className={`btn btn-sm ${userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'}`}
      >
        <i className="fa fa-thumbs-up"></i> Like ({likesCount})
      </button>
      <button
        onClick={() => handleReaction('dislike')}
        className={`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`}
      >
        <i className="fa fa-thumbs-down"></i> Dislike ({dislikesCount})
      </button>
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
          {comments.map((comment, index) => (
            <div key={comment.id || `${comment.username}-${index}`} className="mb-2">
              <small className="text-muted">
                {comment.username} | {new Date(comment.datetime).toLocaleString()}
              </small>
              <p>{comment.content}</p>
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
