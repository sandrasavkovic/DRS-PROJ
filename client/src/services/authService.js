
// Dakle samo SLANJE podataka serveru
// Myb dodati neku sesiju ili nesto (ako budu trazili) da se password ne salje

export const loginUser = (username, password) => {
    return fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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
  