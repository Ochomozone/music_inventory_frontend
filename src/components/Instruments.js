import React, { useState, useEffect } from 'react';
import InstrumentFetcher from '../util/InstrumentSearch';
import './Styles.css';

function Instruments({ baseUrl }) {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstruments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch(baseUrl); 
      if (!response.ok) {
        throw new Error('Failed to fetch instruments');
      }
      const data = await response.json();
      setInstruments(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };


  const handleDataFetched = (data) => {
    setInstruments(data);
  };

  const handleClearFields = async () => {
    setLoading(true);
    setError(null);
    setInstruments([]);
    await fetchInstruments();
  };

  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      <h1>Instruments</h1>
      <h2>Search Instruments</h2>
      <InstrumentFetcher onDataFetched={handleDataFetched} baseUrl={baseUrl} onClear={handleClearFields}/>
      <br />
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Number</th>
              <th>Make</th>
              <th>Model</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {instruments.length > 0 ? (
              instruments.map(instrument => (
                <tr key={instrument.id}>
                  <td>{instrument.description}</td>
                  <td>{instrument.number}</td>
                  <td>{instrument.make}</td>
                  <td>{instrument.model}</td>
                  <td>{instrument.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No instruments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Instruments;
