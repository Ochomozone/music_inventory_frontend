import React, { useState, useEffect, useCallback } from 'react';
import InstrumentFetcher from '../util/InstrumentSearch';
import { ViewInstruments } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { getLocations } from '../util/helpers';

function TakeStock({ baseUrl, profile }) {
  const [allInstruments, setAllInstruments] = useState([]);
  const [searchInstruments, setSearchInstruments] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [locationInstruments, setLocationInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canViewInstruments = ViewInstruments(profile);
  const navigate = useNavigate();

  const fetchLocations = useCallback(async () => {
    try {
      const result = await getLocations(baseUrl);
      if (!result) {
        throw new Error('Failed to fetch Locations');
      }
      setAllLocations(result);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [baseUrl]);

  const fetchInstruments = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/instruments`);
      if (!response.ok) {
        throw new Error('Failed to fetch instruments');
      }
      const data = await response.json();
      setAllInstruments(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchInstruments();
    fetchLocations();
  }, [showSearchResults, fetchInstruments, fetchLocations]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const filterInstruments = useCallback(() => {
    const filteredInstruments = allInstruments.filter(
      (instrument) => instrument.location === location
    );
    setLocationInstruments(filteredInstruments);
  }, [allInstruments, location]);

  useEffect(() => {
    filterInstruments();
  }, [location, filterInstruments]);

 

  const handleDataFetched = (data) => {
    setSearchInstruments(data);
    setShowSearchResults(true);
  };

  const handleClearFields = () => {
    setSearchInstruments([]);
    setShowSearchResults(false);
    setLocation('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      {canViewInstruments ? (
        <div>
          <div className="centered-text">
            <h1>Instruments</h1>
          </div>
          <div className='container-pair'>
            <div className='left-container' style={{ justifyContent: 'flex-start' }}>
                <div>
                    <select value={location} onChange={handleLocationChange}>
                    <option value="">Select Location</option>
                    {allLocations.map((location, index) => (
                        <option key={index} value={location}>
                        {location}
                        </option>
                    ))}
                    </select>
                    <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Number</th>
                            <th>Serial</th>
                            <th>Make</th>
                            
                        </tr>
                        </thead>
                            <tbody>
                    {locationInstruments.map((instrument, index) => (
                        <tr key={index}>
                        <td>{instrument.description}</td>
                                <td>{instrument.number}</td>
                                <td>{instrument.serial}</td>
                                <td>{instrument.make}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>  
            </div>
          <div className='right-contaier'>
          <h2 className="centered-text">Search Instruments</h2>
          <InstrumentFetcher
            onDataFetched={handleDataFetched}
            baseUrl={`${baseUrl}/instruments`}
            onClear={handleClearFields}
          />
          </div>
          </div>
          <div className="table-container">
            {showSearchResults && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Number</th>
                    <th>Serial</th>
                    <th>Make</th>
                    <th>Location</th>
                    <th>Details</th>
                    <th>Confirm Location</th>
                  </tr>
                </thead>
                <tbody>
                  {searchInstruments.length > 0 ? (
                    searchInstruments.map((instrument) => (
                      <tr key={instrument.id}>
                        <td>{instrument.description}</td>
                        <td>{instrument.number}</td>
                        <td>{instrument.serial}</td>
                        <td>{instrument.make}</td>
                        <td>{instrument.location ? instrument.location : instrument.user_name}</td>
                        <td>
                          <button
                            onClick={() =>
                              navigate(
                                `/details?description=${instrument.description}&number=${instrument.number}`,
                                { state: { instrument: instrument } }
                              )
                            }
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No instruments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <Unauthorized profile={profile} />
      )}
    </div>
  );
}

export default TakeStock;
