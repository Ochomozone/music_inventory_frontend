import React, { useState, useEffect } from 'react';
import CheckoutSearch from '../util/CheckoutSearch';
import { NavLink } from 'react-router-dom';
import '../index.css';

function Checkouts({baseUrl}) {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCheckouts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await fetch(`${baseUrl}/checkouts`);
      if (!response.ok) {
        throw new Error('Failed to fetch dispatches');
      }
      const data = await response.json();
      setDispatches(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDataFetched = (data) => {
    setDispatches(data);
  };

  const handleClearFields = async () => {
    setLoading(true);
    setError(null);
    setDispatches([]);
    await fetchCheckouts();
  };

  const handleTurnIn = async (instrumentId, userName, description, number) => {
    const confirmation = window.confirm(`Are you sure you want to turn in ${userName}'s ${description} number ${number}?`);
    if (confirmation) {
      try {
        const response = await fetch(`${baseUrl}/returns?instrumentId=${instrumentId}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to turn in instrument');
        }
        // Reload data after successful turn in
        await fetchCheckouts();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      <div className='centered-text'>
      <NavLink to="/newcheckout">
          <button className='create-checkout-button'><h2>Create New Checkout!</h2></button>
      </NavLink>
      </div>
      <h1 className='centered-text'>Instrument Checkouts</h1>
      <CheckoutSearch  className="navlink-button" onDataFetched={handleDataFetched} baseUrl={`${baseUrl}/checkouts`} onClear={handleClearFields}/>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
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
                  <td>{instrument.user_name}</td>
                  <td>{instrument.description}</td>
                  <td>{instrument.number}</td>
                  <td>{instrument.make}</td>
                  <td>{instrument.serial}</td>
                  <td>
                    <button onClick={() => handleTurnIn(instrument.id, instrument.user_name, instrument.description, instrument.number)}>Turn In</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Instruments found.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
    </div>
  );
}

export default Checkouts;
