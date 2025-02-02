
// Dakle samo SLANJE podataka serveru
import { getApiUrl } from "./api";

// primer kako cemo koristiti :
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
  console.log("Sending request for username:", username);  // Add logging to verify the request

  return fetch(`/auth/get_user_by_username?username=${username}`, {  // Pass username as a query parameter
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


// mozemo koristiti umesto await-a , then i catch
// za obradu asinhronih zahteva

// saljemo id usera, on se ne menja
// i novu vrednost iz input polja za edit
export const updateUser = (username, updatedUser) => {
  console.log("EDITUJEM : ", username)
  console.log(updatedUser)
  return fetch(`/auth/users/${username}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
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

