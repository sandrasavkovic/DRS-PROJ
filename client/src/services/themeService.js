const username = sessionStorage.getItem("user_name");
const discussionId = parseInt(sessionStorage.getItem("id"), 10);

export const deleteTheme = (themeId) => {
  return fetch(`/theme/delete_theme/${themeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to delete theme with id ${themeId}`);
      }
      return response.json(); 
    })
    .then((data) => {
      console.log(data.message); 
      return data;
    })
    .catch((error) => {
      console.error("Error deleting theme:", error);
      throw error;
    });
};

export const modifyTheme = (themeId, updatedTheme) => {
  return fetch(`/theme/modify_theme/${themeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      theme_name: updatedTheme.theme_name,
      description: updatedTheme.description, 
      date_time: updatedTheme.date_time, 
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.error || "Failed to modify theme with id ${themeId}");
        });
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error modifying theme:", error);
      throw error;
    });
};

export const addTheme = (newTheme) => {
  console.log(newTheme);
  return fetch("/theme/add_theme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      theme_name: newTheme.theme_name,
      description: newTheme.description, 
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.error || "Failed to add theme");
        });
      }
      return response.json();  
    })
    .then((data) => {
      console.log("Created theme:", data); 
      return data; 
    })
    .catch((error) => {
      console.error("Error adding theme:", error);
      throw error;  
    });
};

export const fetchThemes = () => {
    return fetch("/theme/theme", {
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

  export const fetchDiscussions = (themeId) => {
    return fetch(`/discussion/discussion/${themeId}`, {
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
        return { data };
      })
      .catch((error) => {
        console.error("Error fetching discussions:", error);
        throw error; 
      });
  };
  


export const updateDiscussion = (discussionId, updatedDiscussion) => {
  return fetch(`/discussion/editDiscussion?id=${discussionId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDiscussion), 
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Error updating discussion');
      }
      return response.json(); 
  })
  .catch((error) => {
      console.error('Error in updatedDiscussion:', error);
      throw error; 
  });
};

export const fetchDiscussionsOfUser = (username) =>{
  console.log("Trazim diskusije usera : ", username)
  return fetch(`/discussion/get_discussions_for?username=${username}`, {  
    method: "GET",
    headers: {
      "Content-Type": "application/json",  
    },  
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    console.error("Error fetching user:", error);
    throw error;
  });
}; 
 
export const getDiscussionById = (discussionId) =>{
  console.log("PROSLEDJEN ID DISKUSIJE : ", discussionId)
  return fetch(`/discussion/get_discussion_by_id?discussionId=${discussionId}`, {  
    method: "GET",
    headers: {
      "Content-Type": "application/json", 
    },  
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    console.error("Error fetching user:", error);
    throw error;
  });
};
