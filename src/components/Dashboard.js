import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; 

function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Extract user information from URL query parameters
    const params = new URLSearchParams(location.search);
    const username = params.get('username');
    const email = params.get('email');

    setUser({ username, email });
  }, [location.search]);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}</h1>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default Dashboard;
