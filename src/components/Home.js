import React, { useState, useEffect } from 'react';

const Home = ({ profile, login, baseUrl}) => {
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
    if (profile && profile.databaseId){
    params.append('userId', profile.databaseId)};
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
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Music Inventory System</h1>
      {!profile && <button onClick={handleLogin}>Log In</button>}
      {profile && (
        <div>
          <p>You are logged in as {profile.name}</p>
          {/* <button onClick={handleLogOut}>Log out</button> */}
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
              dispatches.map(instrument => (
                <tr key={instrument.id}>
                  <td>{instrument.description}</td>
                  <td>{instrument.number}</td>
                  <td>{instrument.make}</td>
                  <td>{instrument.serial}</td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Instruments assigned.</td>
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
