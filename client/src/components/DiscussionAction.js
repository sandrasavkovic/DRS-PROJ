import React, { useState, useEffect } from 'react';
import {
  reactToDiscussion,
  fetchDiscussionReactions,
  fetchDiscussionComments,
  postComment,
  deleteComment
} from '../services/discussionService';
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'font-awesome/css/font-awesome.min.css';
import toast from 'react-hot-toast';

const DiscussionAction = ({ discussion, userId, role }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState('none');

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

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
        setComments(data[0]);
        setCommentsCount(data[1]);

      })
      .catch((error) => console.error('Error fetching comments:', error));

  }, [discussion, userId]);

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
          toast.error(`Failed to ${reactionType} discussion.`);
        });
    } else {
      console.error('User ID is not available');
      toast.error('User ID is not available');
    }
  };

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  useEffect(() => {
    if(!showComments) return;
    fetchDiscussionComments(discussion.id)
      .then(data => setComments(data[0]))
      .catch(err => console.log('Error fetching comments: ', err));

  }, [showComments, discussion.id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty!');
      return;
    }
  
    // Detect mentions using regex (e.g., @username)
    // Pronalazi sva korisnicka imena koja su pomenuta u komentaru
    const mentionPattern = /@(\w+)/g;
    // iterator se pretvara u niz sa poklapanjima sa regex izrazom
    // i uzima se samo username tj. bez @ 
    const mentions = [...newComment.matchAll(mentionPattern)].map(match => match[1]);
  
    postComment(discussion.id, userId, newComment, mentions)
      .then((data) => {
        setComments((prev) => [...prev, data]);
        setNewComment('');
        setCommentsCount(prevCount => prevCount + 1); 

      })
      .catch((error) => console.error('Error posting comment:', error));
  };

  const handleDeleteComment = (commentId) => {
      deleteComment(commentId)
        .then(() => {
          // Ukloni obrisani komentar iz lokalnog stanja
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
          setCommentsCount(prevCount => prevCount - 1); 

          console.log(`Deleted comment with ID: ${commentId}`);
          toast.success("Comment successfully deleted!")
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
          toast.error('Failed to delete comment.');
        });
    
  };

  return (
    <div>
     <div className="d-flex align-items-center"> {/* Poravnanje svih elemenata */}
        {/* Like dugme */}
        <button
          onClick={() => handleReaction('like')}
          className="btn border-0 p-0 mx-2"
          style={{
            fontSize: userReaction === 'like' ? '1.8em' : '1.5em', // Veća ikonica ako je aktivna
            color: userReaction === 'like' ? '#007bff' : '#6c757d', // Plava ako je aktivna, siva inače
            transition: 'font-size 0.2s, color 0.2s',
          }}
        >
          <i className="fa fa-thumbs-up"></i>
        </button>
        <span className="me-3">{likesCount}</span> {/* Razmak između dugmeta i broja */}

        {/* Dislike dugme */}
        <button
          onClick={() => handleReaction('dislike')}
          className="btn border-0 p-0 mx-2"
          style={{
            fontSize: userReaction === 'dislike' ? '1.8em' : '1.5em',
            color: userReaction === 'dislike' ? '#dc3545' : '#6c757d', // Crvena ako je aktivna, siva inače
            transition: 'font-size 0.2s, color 0.2s',
          }}
        >
          <i className="fa fa-thumbs-down"></i>
        </button>
        <span className="me-3">{dislikesCount}</span>

        {/* Comment dugme */}
        <button
          onClick={toggleComments}
          className="btn border-0 p-0 mx-2"
          style={{
            fontSize: showComments ? '1.8em' : '1.5em', // Veća ikonica ako je aktivno
            color: showComments ? '#495057' : '#6c757d', // Tamnosiva ako je aktivno, svetlosiva inače
            transition: 'font-size 0.2s, color 0.2s',
          }}
        >
          <i className="fa fa-comment"></i>
        </button>
        <span className="me-3">{commentsCount}</span> {/* Razmak između dugmeta i broja */}

      
      </div>

      {showComments && (
        <div className="mt-3 p-2 border rounded bg-light">
          <h6>Comments</h6>
          {comments.map((comment) => (
  <div key={comment.id} className="mb-2 d-flex justify-content-between align-items-start">
    <div>
      
      <small className="text-muted">
        @{comment.username}   
      </small>
      <small className="text-muted">
        {new Date(comment.datetime).toLocaleString()}
      </small>
      <p>{comment.content}</p>
    </div>
    

    {(discussion.user_id === userId || userId === comment.user_id || Number(role) === 1) && (
      <button
        className="btn p-0 mx-1"
        onClick={() => handleDeleteComment(comment.id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#dc3545', 
          fontSize: '1.2em',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.color = '#ff6666')} 
        onMouseLeave={(e) => (e.target.style.color = '#dc3545')} 
      >
        <i className="fa fa-trash"></i>
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
              className="btn btn-info"
              data-toggle="tooltip" data-placement="top" title="Post comment">
                <i className="bi bi-send"></i>
            
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionAction;
