import React, { useState, useEffect } from 'react';
import InstrumentFetcher from '../util/InstrumentSearch';
import LostAndFoundSearch from '../util/lostAndFoundSearch';
import { ViewInstruments, CreateNewInstrument } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { NavLink } from 'react-router-dom';
import SwapCasePopup from './SwapCasePopup'; 
import PopupMessage from './PopupMessage';

function Instruments({ baseUrl, profile }) {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSwapPopup, setShowSwapPopup] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [showPopupResponse, setShowPopupResponse] = useState(false);
  const canViewInstruments = ViewInstruments(profile);
  const canCreateNewInstrument = CreateNewInstrument(profile);
  const navigate = useNavigate();

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

  // const closeSwapResponsePopup = () => {
  //   setShowPopupResponse(false);

  const getSwapItemId2 = async (description, number2) => {
    try {
      const response = await fetch(`${baseUrl}/instruments?description=${description}&number=${number2}`);
      if (!response.ok) {
        throw new Error('Failed to fetch instrument');
      }
      const data = await response.json();
      return data[0].id;
    } catch (error) {
      setSwapMessage(error.message);
      // setError(error.message);
    }
  }

  const handleSwap = async (description, code, itemId1, number1, number2) => {
    try {
      const itemId2 = await getSwapItemId2(description, number2);
      console.log(itemId2)
      if (!itemId2 ) {
        setSwapMessage('Invalid number for swapping');
        setShowPopupResponse(true);
        return;
        // throw new Error('That case number does not exist. Please try again.');
        
      }

      const response = await fetch(`${baseUrl}/instruments/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, id_1: itemId1, id_2: itemId2, created_by: profile.username }),
      });
      if (!response.ok) {
        setSwapMessage('An error occured on our server. Cases not swapped');
        setShowPopupResponse(true);

        // throw new Error('An error occured on our server. Cases not swapped');
      }
      await fetchInstruments();
    } catch (error) {
      setSwapMessage(error.message);
      // setError(error.message);
    }
  };

  const handleOpenSwapPopup = (instrument) => {
    setSelectedInstrument(instrument);
    setShowSwapPopup(true);
  };

  const handleCloseSwapPopup = () => {
    setShowSwapPopup(false);
    setSelectedInstrument(null);
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
          {canCreateNewInstrument && (
            <div className='centered-text'>
              <NavLink to="/newInstrument">
                <button className='big-fixed-button'><h2>New Instrument!</h2></button>
              </NavLink>
            </div>
          )}
          <div>
            <div className='centered-text'>
              <h1>Instruments</h1>
            </div>
            <h2 className='centered-text'>Search Instruments</h2>
            <InstrumentFetcher onDataFetched={handleDataFetched} baseUrl={`${baseUrl}/instruments`} onClear={handleClearFields} />
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Number</th>
                    <th>Serial</th>
                    <th>Make</th>
                    <th>Location</th>
                    <th>Details</th>
                    <th>Swap Case</th>
                    <th>Missing?</th>
                  </tr>
                </thead>
                <tbody>
                  {instruments.length > 0 ? (
                    instruments.map(instrument => (
                      <tr key={instrument.id}>
                        <td>{instrument.description}</td>
                        <td>{instrument.number}</td>
                        <td>{instrument.serial}</td>
                        <td>{instrument.make}</td>
                        <td>{instrument.location ? instrument.location : instrument.user_name}</td>
                        <td>
                          <button onClick={() => navigate(`/details?description=${instrument.description}&number=${instrument.number}`, { state: { instrument: instrument }})}>Details</button>
                        </td>
                        <td>
                          <button onClick={() => handleOpenSwapPopup(instrument)}>Swap Case</button>
                        </td>
                        <td>
                          <LostAndFoundSearch baseUrl={baseUrl} itemId={instrument.id} />
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
            </div>
          </div>
        </div>
      ) : (
        <Unauthorized profile={profile} />
      )}
      {showSwapPopup && selectedInstrument && (
        <SwapCasePopup
          code={selectedInstrument.code}
          itemId1={selectedInstrument.id}
          number1={selectedInstrument.number}
          description={selectedInstrument.description}
          createdBy={profile.username}
          onClose={handleCloseSwapPopup}
          onSwap={handleSwap}
        />
      )}
      {showPopupResponse && (
        <PopupMessage message={swapMessage} onClose={() => setShowPopupResponse(false)} />
      )}
    </div>
  );
}

export default Instruments;
