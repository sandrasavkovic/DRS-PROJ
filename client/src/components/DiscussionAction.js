import React from 'react';

// ovdje je handle like, dislike i comment za pojedinacu diskusiju

const DiscussionAction = ({ discussion }) => {
  const handleLike = () => console.log('Liked:', discussion.id);
  const handleDislike = () => console.log('Disliked:', discussion.id);
  const handleComment = () => console.log('Commented on:', discussion.id);

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <button onClick={handleDislike}>Dislike</button>
      <button onClick={handleComment}>Comment</button>
    </div>
  );
};

export default DiscussionAction;
