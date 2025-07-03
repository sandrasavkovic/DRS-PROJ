export const fetchAllDiscussions = () => {
  return fetch("/discussion/getAllDiscussions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data)
      return { data };
    })
    .catch((error) => {
      console.error("Error fetching themes:", error);
      throw error;
    });
};


export const addDiscussion = (user_id, theme_id, discussionText) => {
  return fetch(`/discussion/addDiscussion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user_id,
      themeId: theme_id,
      discussionText: discussionText
  }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to add discussion`);
    }
    return response.json();
  })
  .catch((error) => {
    console.error("Error add discussion:", error);
    throw error;
  });
};


export const modifyDiscussion = (discussionId, updatedDiscussion) => {
  return fetch(`/discussion/edit/${discussionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      theme_id: updatedDiscussion.theme_id, 
      content: updatedDiscussion.content,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to edit discussion with id ${discussionId}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error editing discussion:", error);
      throw error;
    });
};


export const deleteDiscussion = (discussionId) =>{
  return fetch(`/discussion/deleteDiscussion`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(discussionId), 
  })
  .then((response) => {
    if (!response.ok) {
        throw new Error('Failed to delete discussion!');
    }
    return response.json(); 
  })
  .catch((error) => {
    console.error('Error in deleteDiscussion:', error);
    throw error;
  });
}; 


export const fetchDiscussionReactions = (discussionId, userId) => {
  return fetch(`/discussion/fetchReactions`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discussionId, userId }), 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch reactions!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Reactions fetched:", data); 
      return data; 
    })
    .catch((error) => {
      console.error("Error fetching reactions:", error);
      throw error;
    });
};


export const reactToDiscussion = (discussionId, userId, reactionType) => {
  return fetch(`/discussion/react`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discussionId, userId, reactionType }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to react to discussion");
    }
    return res.json();
  });
};


export const fetchDiscussionComments = (discussionId) => {
  return fetch(`/discussion/fetchComments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discussionId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch comments!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Reactions fetched:", data);
      console.log("OVAKO IZGLEDA REZULTAT", data)
      return data;
    })
    .catch((error) => {
      console.error("Error fetching reactions:", error);
      throw error;
    });
};


export const postComment = (discussionId, userId, newComment, mentions) => {
  return fetch('/discussion/postComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ discussionId, userId, newComment, mentions }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to post comment!');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error posting comment:', error);
      throw error;
    });
};

export const deleteComment = (commentId) =>
{
  return fetch(`/discussion/deleteComment`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({commentId }), 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete comment!");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
      throw error;
    });
}


export const getUserIdByUsername = (username) => {
  return fetch(`/discussion/getUserId/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      return data.userId;
    })
    .catch((error) => {
      console.error('Error fetching user ID:', error);
      throw error;
    });
};



