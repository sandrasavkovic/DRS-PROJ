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
        setUserReaction(data.user_reaction);  // Postavljanje početne reakcije
      })
      .catch((error) => {
        console.error('Error fetching reactions:', error);
      });
  }, [discussionId, userId]);

  const handleReaction = (reactionType) => {
    const newReaction = reactionType === userReaction ? 'none' : reactionType;

    if (userId) {
      reactToDiscussion(discussionId, userId, newReaction)
        .then((data) => {
          setLikesCount(data.likes);
          setDislikesCount(data.dislikes);
          setUserReaction(data.user_reaction); // Ažuriraj reakciju korisnika nakon promene
        })
        .catch((error) => {
          console.error(`Error reacting to discussion: ${newReaction}`, error);
          alert(`Failed to ${newReaction} discussion.`);
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
        className={`btn btn-sm ${userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'}`}
        aria-pressed={userReaction === 'like' ? 'true' : 'false'}
      >
        <i className="fa fa-thumbs-up"></i> Like
        {userReaction === 'like' && <span>({likesCount})</span>}
      </button>

      <button
        onClick={() => handleReaction('dislike')}
        className={`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`}
        aria-pressed={userReaction === 'dislike' ? 'true' : 'false'}
      >
        <i className="fa fa-thumbs-down"></i> Dislike
        {userReaction === 'dislike' && <span>({dislikesCount})</span>}
      </button>

      <button onClick={() => console.log('Commented on:', discussionId)}>Comment</button>
    </div>
  );
};

export default DiscussionAction;
