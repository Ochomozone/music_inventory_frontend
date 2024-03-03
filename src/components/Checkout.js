import React, { useState, useEffect } from 'react';
import CheckoutSearch from '../util/CheckoutSearch';
import { NavLink } from 'react-router-dom';
import './Styles.css';

function Checkouts({baseUrl}) {
  const [dispatches, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCheckouts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch dispatches');
      }
      const data = await response.json();
      setCheckouts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDataFetched = (data) => {
    setCheckouts(data);
  };

  const handleClearFields = async () => {
    setLoading(true);
    setError(null);
    setCheckouts([]);
    await fetchCheckouts();
  };

  const handleTurnIn = async (instrumentId, userName, description, number) => {
    const confirmation = window.confirm(`Are you sure you want to turn in ${userName}'s ${description} number ${number}?`);
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:4001/returns?instrumentId=${instrumentId}`, {
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
      <div>
      <NavLink to="/newcheckout">
        <h1>Create New Checkout</h1>
      </NavLink>
      <h1>Instrument Checkouts</h1>
      <CheckoutSearch  className="navlink-button" onDataFetched={handleDataFetched} baseUrl={baseUrl} onClear={handleClearFields}/>
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
    </div>
  );
}

export default Checkouts;
