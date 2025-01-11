const API_URL = process.env.REACT_APP_API_URL;

// Login User
export const loginUser = (email, password) => {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => res.json());
};

// Register User
export const registerUser = (username, password, name, last_name, address, city, country, phone_number, email) => {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, name, last_name, address, city, country, phone_number, email }),
  }).then((res) => res.json());
};

// Get User by Username
export const getUserByUsername = (username) => {
  return fetch(`${API_URL}/auth/get_user_by_username?username=${username}`, {
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

// Update User
export const updateUser = (username, updatedUser) => {
  return fetch(`${API_URL}/auth/users/${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error updating user");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error in updateUser:", error);
      throw error;
    });
};
