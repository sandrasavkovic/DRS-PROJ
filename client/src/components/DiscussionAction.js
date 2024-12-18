import React, { useState, useEffect } from 'react';
import { reactToDiscussion, getDiscussionReactions } from '../services/discussionService';

const DiscussionAction = ({ discussionId, userId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  useEffect(() => {
    getDiscussionReactions(discussionId)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
      })
      .catch((error) => console.error('Error fetching reactions:', error));
  }, [discussionId]);

  const handleReaction = (reactionType) => {
    reactToDiscussion(discussionId, userId, reactionType)
      .then((data) => {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
      })
      .catch((error) => {
        console.error(`Error reacting to discussion: ${reactionType}`, error);
        alert(`Failed to ${reactionType} discussion.`);
      });
  };

  return (
    <div>
      <button onClick={() => handleReaction('like')}>
        Like <span>({likesCount})</span>
      </button>
      <button onClick={() => handleReaction('dislike')}>
        Dislike <span>({dislikesCount})</span>
      </button>
      <button onClick={() => console.log('Commented on:', discussionId)}>Comment</button>
    </div>
  );
};

export default DiscussionAction;
