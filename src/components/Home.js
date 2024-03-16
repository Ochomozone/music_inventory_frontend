import React, { useState, useEffect } from 'react';
import InstrumentFetcher from '../util/VanillaInstrumentSearch';
import LostAndFoundSearch from '../util/lostAndFoundSearch';
import '../index.css';

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
    <div className='page'>
      <div className='Container'>
      <h1>Music Inventory System</h1>
      <h2 className='centered-text'>Lost and Found</h2>
      </div>
      <InstrumentFetcher  baseUrl={baseUrl} profile={profile}/>
      {!profile && <button onClick={handleLogin}>Log In</button>}
      {profile && (
        <div>
          <h2 className='centered-text'>Instruments Assigned To You:</h2>
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
                  <th>Missing? </th>
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
                      <td>
                      <LostAndFoundSearch
                          baseUrl={baseUrl}
                          itemId={instrument.id}
                          profile={profile}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className='centered-text'>
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
