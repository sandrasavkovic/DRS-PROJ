// hooks/useDiscussions.js
import { useState, useEffect } from 'react';
import { fetchAllDiscussions } from '../services/discussionService';

const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Instead of async/await, use .then() and .catch()
    fetchAllDiscussions()
      .then((response) => {
        setDiscussions(response.data);
      })
      .catch((err) => {
        setError(err);
        console.error('Error fetching discussions:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { discussions, loading, error };
};

export default useDiscussions;
