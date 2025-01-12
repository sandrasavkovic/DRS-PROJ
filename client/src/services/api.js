// ovo ce biti pomocni fajl u kom cemo putanju zahteva
// definisati na osnovu toga da li program pokrecemo 
// na lokalnoj masini ili na cloud-u

// api.js
const apiUrl = process.env.REACT_APP_API_URL;

export const getApiUrl = (path) => `${API_URL}${path}`;
