// //import axios from 'axios';

// const API_URL = '/api/themes'; // Endpoint za teme (backend rute)

// // Funkcija za dobavljanje tema od servera
// export const fetchThemes = () => {
//   //sreturn get(API_URL);
// };
// ovo cemo slati funkcijama u bekendu 

const username = sessionStorage.getItem("user_name");
const discussionId = parseInt(sessionStorage.getItem("id"), 10);

//NAJNOVIJI KOD ZA IZMJENU DISKUSIJE
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
        throw new Error(`Failed to modify theme with id ${themeId}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error modifying theme:", error);
      throw error;
    });
};

export const addTheme = (newTheme) => {
  console.log(newTheme)
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
        throw new Error("Failed to add theme");
      }
      return response.json();
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
        // Pretpostavljamo da API vraća listu tema u JSON formatu
        console.log(data)
        return { data };
      })
      .catch((error) => {
        console.error("Error fetching themes:", error);
        throw error; // Prosljeđujemo grešku kako bi se mogla obraditi u `User` komponenti
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
        // Pretpostavljamo da API vraća listu diskusija u JSON formatu
        return { data };
      })
      .catch((error) => {
        console.error("Error fetching discussions:", error);
        throw error; // Prosljeđujemo grešku kako bi se mogla obraditi u `User` komponenti
      });
  };
  

  // dodavanje diskusije na neku temu
  export const addDiscussion = (user_id, theme_id, discussionText) => {
    return fetch(`/theme/addDiscussion`, {
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
  

/*
export const getDiscussionById = (discussionId) => {
  console.log("disc je tu");
  console.log("Sending request for id:", discussionId);  // Add logging to verify the request

  return fetch(`/discussion/${discussionId}`, {  // Pass username as a query parameter
    method: "GET",
    headers: {
      "Content-Type": "application/json",  // You can still include headers, but no body for GET
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching discussion:", error);
      throw error;
    });
};
*/

export const updateDiscussion = (discussionId, updatedDiscussion) => {
  console.log("EDITING: ", discussionId);
  console.log("UPDATED DATA: ", updatedDiscussion);

  return fetch(`/discussion/editDiscussion?id=${discussionId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDiscussion), // Send updated data in the request body
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Error updating discussion');
      }
      return response.json(); // Parse and return the JSON response
  })
  .catch((error) => {
      console.error('Error in updatedDiscussion:', error);
      throw error; // Re-throw to propagate the error to the calling function
  });
};

export const fetchDiscussionsOfUser = (username) =>{
  console.log("Trazim diskusije usera : ", username)
  return fetch(`/discussion/get_discussions_for?username=${username}`, {  
    method: "GET",
    headers: {
      "Content-Type": "application/json",  // You can still include headers, but no body for GET
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
      "Content-Type": "application/json",  // You can still include headers, but no body for GET
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

export const deleteDiscussion = (discussionId) =>{
  console.log("PROSLEDJEN ID DISKUSIJE : ", discussionId)
  return fetch(`/discussion/deleteDiscussion`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(discussionId), // Send updated data in the request body
  })
  .then((response) => {
    if (!response.ok) {
        throw new Error('Error deleting discussion');
    }
    return response.json(); // Parse and return the JSON response 
  })
  .catch((error) => {
    console.error('Error in deleteDiscussion:', error);
    throw error; // Re-throw to propagate the error to the calling function
  });
}; 