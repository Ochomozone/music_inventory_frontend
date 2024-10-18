import React, { useState, useEffect } from 'react';
import { getAvailableNumbers, getEquipment, getLocations, getInstrumentStates } from '../util/helpers';
import PopupMessage from './PopupMessage';
import { CreateCheckout as CreateNewInstrument } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import LoadingSpinner from '../util/LoadingSpinner';
import '../index.css';

const fetchData = async (baseUrl, data) => {
  try {
    const response = await fetch(`${baseUrl}/instruments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};

const NewInstrument = ({ baseUrl, profile }) => {
  const [description, setDescription] = useState('');
  const [make, setMake] = useState('CUSTOM');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [location, setLocation] = useState('INSTRUMENT STORE');
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableInstrumentStates, setAvailableInstrumentStates] = useState([]);
  const profileId = profile ? profile.databaseId : null;
  const username = profile ? profile.username : null;
  const [showNumberSelection, setShowNumberSelection] = useState(false);
  const [lockInputFields, setLockInputFields] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null); 
  const [instrumentState, setInstrumentState] = useState('New');
  const canCreateInstrument = CreateNewInstrument(profile);


  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        setLoading(true);
        const equipment = await getEquipment(baseUrl);
        const locations = await getLocations(baseUrl);
        const instrumentConditions = await getInstrumentStates(baseUrl);
        setAvailableEquipment(equipment);
        setAvailableLocations(locations);
        setAvailableInstrumentStates(instrumentConditions);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setPopupMessage('Failed to fetch initial data: ', error); 
      }
      setLoading(false);
    };

    fetchInitialData(); 
  }, [baseUrl]);

  const fetchAvailableNumbers = async () => {
    setLoading(true);
    try {
      const numbers = await getAvailableNumbers(baseUrl,description);
      setAvailableNumbers(numbers);
      setShowNumberSelection(true); 
    } catch (error) {
      setPopupMessage('Failed to fetch available numbers');
    }
    setLoading(false);
  };



  const handleFetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchData(baseUrl, { 
        description, 
        make, 
        ...(serial !== '' && { serial }), 
        ...(model !== '' && { model }), 
        instrumentState, 
        location, 
        selectedNumber, 
        profileId, 
        username 
      });
      if (data) {
        // onDataFetched(data);
        const { message } = data;
        setPopupMessage(message);
      }
    } catch (error) {
      setPopupMessage('Failed to fetch data', error); // Set error message
    }
    setLoading(true);
  };

  const handleClearFields = async () => {
    setDescription('');
    setAvailableNumbers([]);
    setShowNumberSelection(false);
    setSerial('');
    setPopupMessage(null);
    setSelectedNumber('');
    setLockInputFields(false);

   
  };

  const handleResetStates = () => {
    fetchAvailableNumbers();
    setSelectedNumber('');
    setPopupMessage(null);
    setSerial('');
    setLockInputFields(false);

  };
  if (loading) {
    return <LoadingSpinner />;
  };
  

  return (
    <div className="container">
       {canCreateInstrument ?( <div>
        <div className='container-pair'>
            <div className='left-container'>
                <label htmlFor="location">Location:</label>
            </div>
            <div className='right-container'>
                <select
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoComplete='off'
                    disabled={lockInputFields}
                >
                    <option value="">Select Location</option>
                    {availableLocations.map((location, index) => (
                    <option 
                      key={index} 
                      value={location}
                    >{location}
                    </option>
                    ))}
                </select>
            </div>
        </div>
        <div className='container-pair'>
            <div className='left-container'>
                <label htmlFor="description">Description:</label>
            </div>
            <div className='right-container'>
                <select
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoComplete='off'
                    disabled={lockInputFields}
                >
                    <option value="">Select Description</option>
                    {availableEquipment.map((equipment, index) => (
                    <option key={index} value={equipment}>{equipment}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className='container-pair'>
            <div className='left-container'>
                <label htmlFor="make">Make:</label>
            </div>
            <div className='right-container'>
                <input
                    type="text"
                    id="make"
                    name="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    disabled={lockInputFields}
                />
            </div>
        </div>
        <div className='container-pair'>
            <div className='left-container'>
                <label htmlFor="model">Model:</label>
            </div>
            <div className='right-container'>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={lockInputFields}
                />
            </div>
        </div>
        <div className='container-pair'>
            <div className='left-container'>
                <label htmlFor="serial">Serial:</label>
            </div>
            <div className='right-container'>
                <input
                    type="text"
                    id="serial"
                    name="serial"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    disabled={lockInputFields}
                />
            </div>
        </div>
        <div className='container-pair'>
            <div className='left-container'>
                <label htmlFor="condition">Condition:</label>
            </div>
            <div className='right-container'>
                <select
                    id="condition"
                    name="condition"
                    value={instrumentState}
                    onChange={(e) => setInstrumentState(e.target.value)}
                    autoComplete='on'
                    disabled={lockInputFields}
                >
                    <option value="">Select Condition</option>
                    {availableInstrumentStates.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className='container-pair'>
        <div className='left-container'>
          <button type="button" onClick={handleClearFields}>Clear</button>
        </div>
        <div className='right-container'>
          {showNumberSelection ? (
            <div>
              <select
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(e.target.value)}
              >
                <option value="">Select Number</option>
                {availableNumbers.map((number, index) => (
                  <option 
                    key={index} 
                    value={number}
                    name="number"
                    >{number}</option>
                ))}
              </select>
             
            </div>
            ) : (
            <button
              type="button"
              name="next-button"
              onClick={() => {
                fetchAvailableNumbers();
                setLockInputFields(true);
              }}
              disabled={description.length < 2 || location.length < 2 || instrumentState.length < 2 || make.length < 2 }
            >
              Next
            </button>

            )}
          </div>
          </div>
          <div className='centered-text'>
          {selectedNumber &&( <button 
                 onClick={() => {
                  handleFetchData();
                  setLockInputFields(true);
                  }}
                name="submit"
                type="button"
              > Submit
              </button>)}
          </div>
        
      
      {popupMessage && <PopupMessage message={popupMessage} onClose={() =>  handleResetStates()} />}
      </div>) : (
        <Unauthorized profile={profile}/>
      )}
    </div>
  );
};

export default NewInstrument;
