import React, { useState, useEffect } from 'react';
import CheckoutSearch from '../util/CheckoutSearch';
import PopupMessage from './PopupMessage';
import LoadingSpinner from '../util/LoadingSpinner';
import { NavLink } from 'react-router-dom';
import '../index.css';
import { ViewCheckouts, CreateCheckout ,TurnInCheckout} from '../util/Permissions';
import Unauthorized from './Unauthorized';

function Checkouts({baseUrl, profile}) {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState(null);
  const canCreateCheckout = CreateCheckout(profile);
  const canViewCheckouts = ViewCheckouts(profile);
  const canTurnInCheckout = TurnInCheckout(profile);

  useEffect(() => {
    fetchCheckouts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (timestamp){return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // hour: '2-digit',
      // minute: '2-digit',
    });}
    else{return null}
  };

  const fetchCheckouts = async () => {
    try {
      const response = await fetch(`${baseUrl}/checkouts`);
      if (!response.ok) {
        setInfoMessage('Failed to fetch checkouts');
      }
      const data = await response.json();
      setDispatches(data);
      setLoading(false);
    } catch (error) {
      setInfoMessage(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  const handleDataFetched = (data) => {
    setDispatches(data);
  };

  const handleClearFields = async () => {
    setLoading(true);
    setDispatches([]);
    await fetchCheckouts();
  };

  const handleTurnIn = async (instrumentId, userName, description, number, formerUserId, profile) => {
    const confirmation = window.confirm(`Are you sure you want to turn in ${userName}'s ${description} number ${number}?`);
    if (confirmation) {
      try {
        const response = await fetch(`${baseUrl}/returns?instrumentId=${instrumentId}&userName=${profile.username}&userId=${profile.databaseId}&formerUserId=${formerUserId}`, {
          method: 'POST',
        });
        if (!response.ok) {
          setInfoMessage('Failed to turn in instrument');
        }
      } catch (error) {
        setInfoMessage(error.message);
      }
    }
  };

  const closeInfoPopup = () => {
    setInfoMessage(null);
  };

  if (infoMessage) {
    return <PopupMessage message={infoMessage} onClose={closeInfoPopup} />;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
     
     {canCreateCheckout && (<div className='centered-text'>
      <NavLink to="/newcheckout">
          <button className='big-fixed-button'><h2>Create New Checkout!</h2></button>
      </NavLink>
      </div>)}
      <h1 className='centered-text'>Instrument Checkouts</h1>
      {canViewCheckouts && (
        <CheckoutSearch
          className="navlink-button"
          onDataFetched={handleDataFetched}
          baseUrl={`${baseUrl}/checkouts`}
          onClear={handleClearFields}
        />
)}
      {canViewCheckouts ? (<div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Description</th>
              <th>Number</th>
              <th>Make</th>
              <th>Serial</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dispatches.length > 0 ? (
              dispatches.map(instrument => (
                <tr key={instrument.id}>
                  <td>{instrument.user_name}</td>
                  <td>{instrument.description}</td>
                  <td>{instrument.number}</td>
                  <td>{instrument.make}</td>
                  <td>{instrument.serial}</td>
                  <td>{formatDate(instrument.issued_on)}</td>
                  {canTurnInCheckout &&(<td>
                    <button onClick={() => handleTurnIn(instrument.id, instrument.user_name, instrument.description, instrument.number, instrument.user_id, profile)}>Turn In</button>
                  </td>)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Instruments found.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>) : (
          <Unauthorized profile={profile} />
        )}
    </div>
  );
}

export default Checkouts;
