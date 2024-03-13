import React, { useState, useEffect } from 'react';

const Home = ({ profile, login, baseUrl }) => {
  const [dispatches, setDispatches] = useState([]);
  const [error, setError] = useState(null);
  const handleLogin = () => {
    if (login) {
      login();
    }
  };

  useEffect(() => {
    if (profile && profile.databaseId) {
      fetchCheckouts(baseUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, baseUrl]);

  const fetchCheckouts = async () => {
    let url = `${baseUrl}/checkouts`;
    const params = new URLSearchParams();
    if (profile && profile.databaseId) {
      params.append('userId', profile.databaseId);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch dispatches');
      }
      const data = await response.json();
      setDispatches(data);
      setError(null); // Reset error state if successful
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseError = () => {
    setError(null); // Clear the error state when closing the popup
  };

  return (
    <div>
      <h1>Music Inventory System</h1>
      {!profile && <button onClick={handleLogin}>Log In</button>}
      {profile && (
        <div>
          <h2>Instrument Assigned To You:</h2>
          {/* <button onClick={handleLogOut}>Log out</button> */}
          {error && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={handleCloseError} className="close-button">
                  &times;
                </button>
                <p>{error}</p>
              </div>
            </div>
          )}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Number</th>
                  <th>Make</th>
                  <th>Serial</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.length > 0 ? (
                  dispatches.map((instrument) => (
                    <tr key={instrument.id}>
                      <td>{instrument.description}</td>
                      <td>{instrument.number}</td>
                      <td>{instrument.make}</td>
                      <td>{instrument.serial}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Instruments assigned to you.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
