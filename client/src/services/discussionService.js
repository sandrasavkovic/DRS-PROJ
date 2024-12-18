//SVE za DISKUSIJE

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
