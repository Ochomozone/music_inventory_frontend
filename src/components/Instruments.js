import React, { useState, useEffect } from 'react';
import InstrumentFetcher from '../util/InstrumentSearch';
import LostAndFoundSearch from '../util/lostAndFoundSearch';
import { ViewInstruments, CreateNewInstrument } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import '../index.css';
import { NavLink } from 'react-router-dom';
// import './Styles.css';

function Instruments({ baseUrl, profile }) {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canViewInstruments = ViewInstruments(profile);
  const canCreateNewInstrument = CreateNewInstrument(profile);

  useEffect(() => {
    fetchInstruments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch(`${baseUrl}/instruments`); 
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
      {canViewInstruments ?(<div>
      {canCreateNewInstrument &&(<div className='centered-text'>
      <NavLink to="/newInstrument">
          <button className='create-checkout-button'><h2>New Instrument!</h2></button>
      </NavLink>
      </div>)}
      <div>
        <h1>Instruments</h1>
       
      <h2 className='centered-text'>Search Instruments</h2>
      
      <InstrumentFetcher onDataFetched={handleDataFetched} baseUrl={`${baseUrl}/instruments`} onClear={handleClearFields}/>
    
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Number</th>
              <th>Make</th>
              <th>Model</th>
              <th>Location</th>
              <th>Details</th>
              <th>Missing?</th>
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
      <td>{instrument.location ? instrument.location : instrument.user_name}</td>
      <td>
        <NavLink
          to={`/details?description=${instrument.description}&number=${instrument.number}`}>
            <button className='button'><h2>Details</h2></button>
        </NavLink>
      </td>
      <td>
          <LostAndFoundSearch
          baseUrl={baseUrl}
          itemId={instrument.id}
          />
      </td>
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
      </div>) : (
        <Unauthorized profile={profile}/>
      
      )}
    </div>
  );
}

export default Instruments;
