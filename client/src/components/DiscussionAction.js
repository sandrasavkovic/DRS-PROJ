import React, { useState, useEffect } from 'react';
import { reactToDiscussion, fetchDiscussionReactions } from '../services/discussionService';
import 'font-awesome/css/font-awesome.min.css';

const DiscussionAction = ({ discussionId, userId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userReaction, setUserReaction] = useState('none');

  // Učitavanje reakcija na početku
  useEffect(() => {
    fetchDiscussionReactions(discussionId, userId)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
        console.log(data.user_reaction);
        setUserReaction(data.user_reaction);  // Postavljanje početne reakcije
      })
      .catch((error) => {
        console.error('Error fetching reactions:', error);
      });
  }, [discussionId, userId]);

  useEffect(() => {
    console.log('User reaction changed to:', userReaction);
  }, [userReaction]);

  const handleReaction = (reactionType) => {
    if (userId) {
      console.log(reactionType)
      reactToDiscussion(discussionId, userId, reactionType)
        .then((data) => {
          setLikesCount(data.likes);
          setDislikesCount(data.dislikes);
          console.log(data.user_reaction);
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

  return (
    <div>
      <button
        onClick={() => handleReaction('like')}
        className="btn btn-primary" // Bootstrap blue button
      >
        <i className="fa fa-thumbs-up"></i> Like
        <span>({likesCount})</span>
      </button>

      <button
        onClick={() => handleReaction('dislike')}
        className="btn btn-danger" // Bootstrap red button
      >
        <i className="fa fa-thumbs-down"></i> Dislike
        <span>({dislikesCount})</span>
      </button>

      <button onClick={() => console.log('Commented on:', discussionId)}>Comment</button>
    </div>
  );
};

export default DiscussionAction;
