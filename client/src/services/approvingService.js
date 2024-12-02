export const fetchPendingRequests = () => {
    return fetch("/approving/pending-requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };
  
  export const acceptRequest = (userId) => {
    return fetch(`/approving/accept-request/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), 
    }).then((res) => res.json());  
  };
  
  export const declineRequest = (userId) => {
    return fetch(`/approving/decline-request/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),  
    }).then((res) => res.json()); 
  };
  