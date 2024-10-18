import React, { useState, useEffect } from 'react';
import InstrumentFetcher from '../util/VanillaInstrumentSearch';
import LostAndFoundSearch from '../util/lostAndFoundSearch';
import { useNavigate } from 'react-router-dom';
import { RequestInstruments } from '../util/Permissions';
import PopupMessage from './PopupMessage';
import '../index.css';

const Home = ({ profile, login, baseUrl, popupMessage }) => {
  const [dispatches, setDispatches] = useState([]);
  const [error, setError] = useState(null);
  const userId = profile && profile.databaseId;
  const handleLogin = () => {
    if (login) {
      login();
    }
  };

  const navigate = useNavigate();
  const canRequestInstruments = RequestInstruments(profile);

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
  const handlePopupClose = () => {
    if (popupMessage) {
      popupMessage = null;
    }
    return (
      <Home/>
    )
  } 
  if (popupMessage) {
    return <PopupMessage message={popupMessage} onClose={handlePopupClose}/>;
  }

  return (
    <div className='page'>
      <div className='Container'>
      <h1 className='centered-text'>Music Inventory System</h1>
      <h2 className='centered-text'>Lost and Found</h2>
      </div>
      <InstrumentFetcher  baseUrl={baseUrl} profile={profile}/>
      {!profile && <button onClick={handleLogin}>Log In</button>}
      {profile && (
        <div>
        <div className='centered-text'>
        <h2>Instrument Requests</h2>
        </div>
        <div className='container-pair'>
          <div className='left-container'>
          <button onClick={() => navigate(
            `/requests?userId=${userId}`)}>View My Requests</button>
          </div>
          {canRequestInstruments &&(<div className='right-container'>
          <button onClick={() => navigate(
            `/newrequest`)}>Make New Request</button>
          </div>)}
        </div>

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
