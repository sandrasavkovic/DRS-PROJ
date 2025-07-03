
export const loginUser = (email, password) => {
  return fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());
};

export const registerUser = (username, password, name, last_name, address, city, country, phone_number, email) => {
  return fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, name, last_name, address, city, country, phone_number, email}),
  }).then((res) => res.json());
};

export const getUserByUsername = (username) => {
  console.log("TUUUUUUUUUUUUUUUUU");
  console.log("Sending request for username:", username);  

  return fetch(`/auth/get_user_by_username?username=${username}`, { 
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



export const updateUser = (username, updatedUser) => {

  return fetch(`/auth/users/${username}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error('Error updating user');
      }
      return response.json(); // Parse and return the JSON response
  })
  .catch((error) => {
      console.error('Error in updateUser:', error);
      throw error; // Re-throw to propagate the error to the calling function
  });
};

