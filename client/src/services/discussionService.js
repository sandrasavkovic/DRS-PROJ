//SVE za DISKUSIJE

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
        throw new Error("Network response was not ok");
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



// u bazi je id pa pomocu username pronalazimo id!
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
  

  /*
  export const likeDiscussion = (discussionId) => {
    return fetch(`/discussion/likeDiscussion/${discussionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ discussionId }), 
    }).then((res) => res.json());  
  };

  export const dislikeDiscussion = (discussionId) => {
    return fetch(`/discussion/dislikeDiscussion/${discussionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ discussionId }), 
    }).then((res) => res.json());  
  };
  */
