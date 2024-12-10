// //import axios from 'axios';

// const API_URL = '/api/themes'; // Endpoint za teme (backend rute)

// // Funkcija za dobavljanje tema od servera
// export const fetchThemes = () => {
//   //sreturn get(API_URL);
// };
// ovo cemo slati funkcijama u bekendu 
const username = sessionStorage.getItem("user_name");
const discussionId = parseInt(sessionStorage.getItem("id"), 10);


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
export const addDiscussion = (theme, discussionText) => {
  console.log("Dodajem diskusiju na temu : ", theme.theme_name)
  console.log("Tekst diskusije : ", discussionText)
  return fetch(`/theme/addDiscussion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,  // Pass the username from sessionStorage
      theme: theme,
      discussionText: discussionText
  }),
  }).then((res) => res.json());
  
};


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

export const updatedDiscussions = (discussionId, updatedDiscussion) => {
  console.log("EDITUJEM : ", discussionId)
  console.log(updatedDiscussion)
  return fetch(`/discussion/${discussionId}`, {
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
      return response.json(); // Parse and return the JSON response
  })
  .catch((error) => {
      console.error('Error in updatedDiscussion:', error);
      throw error; // Re-throw to propagate the error to the calling function
  });
};