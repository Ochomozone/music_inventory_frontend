import React, { useState } from 'react';
import LoadingSpinner from '../util/LoadingSpinner';
import './NewCheckout.css';
import PopupMessage from './PopupMessage';
import { CreateCheckout } from '../util/Permissions';
import Unauthorized from './Unauthorized';
const fetchCheckoutData = async (baseUrl, description = '', number = '', userId = '', profileId = '', username = '', fullname = '') => {
    const url = `${baseUrl}/checkouts`;
    const body = JSON.stringify({ description, number, userId, profileId, username,fullname});

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (!response.ok) {
            throw new Error('Failed to fetch checkout data');
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error dispatching instrument:', error);
        return null;
    }
};


const fetchUserData = async (baseUrl, userName = '', userDivision = '', classValue = '') => {
  let url = `${baseUrl}/users`;
  const params = new URLSearchParams();

  if (userName.length > 0) {
    params.append('userName', userName);
  }
  if (userDivision.length > 0) {
    params.append('userDivision', userDivision);
  }
  if (classValue.length > 0) {
    params.append('classValue', classValue);
  }

  if (params.toString()) {
    url += `?${params.toString()}`; 
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const fetchInstrumentData = async (baseUrl, instrumentLocation, instrumentName = '', instrumentNumber = '') => {
    let url = `${baseUrl}/available`;
    const params = new URLSearchParams();
    params.append('location', instrumentLocation);
  
    if (instrumentName.length > 0) {
      params.append('description', instrumentName);
    }
    if (instrumentNumber.length > 0) {
      params.append('number', instrumentNumber);
    }
  
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch instrument data');
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error fetching instrument data:', error);
      return null;
    }
  };

const NewCheckout = ({ baseUrl, profile }) => {
    const [userName, setUserName] = useState('');
    const [userDivision, setUserDivision] = useState('');
    const [classValue, setClassValue] = useState('');
    const [userData, setUserData] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [error, setError] = useState(null);
    const [description, setDescription] = useState('');
    const [number, setNumber] = useState('');
    const [instrumentData, setInstrumentData] = useState([]);
    const [selectedInstrumentDescription, setSelectedInstrumentDescription] = useState('');
    const [selectedInstrumentNumber, setSelectedInstrumentNumber] = useState('');
    const [selectedInstrumentRow, setSelectedInstrumentRow] = useState(null);
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    const instrumentLocation = profile.room;
    const canCheckout = CreateCheckout(profile);
  
    const handleUserSearch = async () => {
      setLoading(true);
      try {
        const fetchedUserData = await fetchUserData(baseUrl, userName, userDivision, classValue);
        const fetchedUsers = fetchedUserData.filter(item=> item.full_name)
        if (fetchedUsers.length === 0) {
          setInfoMessage('No matching users found');
          handleClearUserFields();}
          else {
        setUserData(fetchedUserData); }
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
  
    const handleSelectUser = (userId, userName, index) => {
      setSelectedUserId(userId);
      setSelectedUserName(userName);
      setSelectedRow(index);
    };
    const handleClearUserFields = async () => {
        setUserName('');
        setUserDivision('');
        setClassValue('');
        setUserData([]);
        setSelectedUserId('');
        setSelectedRow(null);
      };

    const handleInstrumentSearch = async () => {
      setLoading(true);
        try {
          let availableInstruments = [];
          const fetchedInstrumentData = await fetchInstrumentData(baseUrl, instrumentLocation, description, number);
          availableInstruments = fetchedInstrumentData.filter(item=> item.location === instrumentLocation)
          if (availableInstruments.length === 0) {
            setInfoMessage('No matching instruments available at this location');
            handleClearInstrumentFields();}
            else {
          setInstrumentData(fetchedInstrumentData.filter(item=> item.location === instrumentLocation)); }
        } catch (error) {
          setError(error.message);
        }
        setLoading(false);
      };

      const handleSelectInstrument = (instrumentDescription, instrumentNumber, index) => {
        setSelectedInstrumentDescription(instrumentDescription);
        setSelectedInstrumentNumber(instrumentNumber);
        setSelectedInstrumentRow(index);
      };

      const handleClearInstrumentFields = async () => {
        setDescription('');
        setNumber('');
        setInstrumentData([]);
        setSelectedInstrumentDescription('');
        setSelectedInstrumentNumber('');
        setSelectedInstrumentRow(null);
      };

      const handleClearMessagePopup = () => {
        setInfoMessage('');
      };

      const handleSubmitCheckout = async () => {
        const confirmation = window.confirm(`Are you sure you want to assign this user ${selectedInstrumentDescription} number ${selectedInstrumentNumber} to ${selectedUserName}?`);
        if (confirmation) {
        try {
          if (!selectedInstrumentNumber || !selectedUserId || !selectedInstrumentDescription) {
            setInfoMessage('Error::Please select both a user and an instrument');
          }
          const checkoutData = await fetchCheckoutData(
            baseUrl,
            selectedInstrumentDescription,
            selectedInstrumentNumber,
            selectedUserId,
            profile.databaseId,
            profile.username,
            selectedUserName
          );
          if (!checkoutData) {
            setInfoMessage('Error: Failed to submit checkout');
          }
          setCheckoutMessage(checkoutData.message);
          setShowPopup(true); 
          setSelectedInstrumentNumber('');
          setSelectedInstrumentDescription('');
          setSelectedUserId('');
          setInstrumentData([]);
          setUserData([]);
          setDescription('');
          setNumber('');
          setUserName('');
          setUserDivision('');
          setClassValue('');
          setSelectedRow(null);
          setSelectedInstrumentRow(null);
        } catch (error) {
            setError(error.message);
        }
      }
      };
    if (!canCheckout) {
      return <Unauthorized profile />;
    };
    if (loading) {
      return <LoadingSpinner />;
    }
    if (infoMessage) {
      return <PopupMessage message={infoMessage} onClose={handleClearMessagePopup} />;
    }
    
      
  
    return (
        <div className="search-page">
        <div className="checkout-container">
          <div className="search-section">
            <div className="search-box">
              <h2>Search User</h2>
              <label htmlFor="userName">
                Name:
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete='off'
                />
              </label>
              <label htmlFor="userDivision">
                Division:
                <input
                  type="text"
                  id="userDivision"
                  name="userDivision"
                  value={userDivision}
                  onChange={(e) => setUserDivision(e.target.value)}
                  autoComplete='off'
                />
              </label>
              <label htmlFor="classValue">
                Class:
                <input
                  type="text"
                  id="classValue"
                  name="classValue"
                  value={classValue}
                  onChange={(e) => setClassValue(e.target.value)}
                  autoComplete='off'
                />
              </label>
              {( userName || userDivision || classValue) &&(<div>
              <button 
                type="button" 
                onClick={handleUserSearch}>Search</button>
              <button type="button" onClick={handleClearUserFields}>Clear</button>
              </div>)}
            </div>
            {userData.length >0 &&(<div className="search-results">
              <h2>Select User</h2>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user, index) => (
                    <tr key={user.id} className={selectedRow === index ? 'selected' : ''}>
                      <td>{user.full_name}</td>
                      <td>{user.grade_level}</td>
                      <td>
                        <button onClick={() => handleSelectUser(user.id, user.full_name, index)}>Select</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>)}
          </div>
          <div className="instrument-search-section">
            <div className="instrument-search-box">
              <h2>Select Instrument</h2>
              <label htmlFor="instrumentName">
                Description:
                <input
                  type="text"
                  id="instrumentName"
                  name="instrumentName"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoComplete='off'
                />
              </label>
              <label htmlFor="instrumentNumber">
                Number:
                <input
                  type="text"
                  id="instrumentNumber"
                  name="instrumentNumber"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  autoComplete='off'
                />
              </label>
              {description &&(<div>
              <button type="button" onClick={handleInstrumentSearch}>Search</button>
              <button type="button" onClick={handleClearInstrumentFields}>Clear</button>
              </div>)}
            </div>
           {instrumentData.length > 0 &&( <div className="search-results instrument-search-results">
              <h2>Instrument Results</h2>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Number</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {instrumentData.map((instrument, index) => (
                    <tr key={instrument.id} className={selectedInstrumentRow === index ? 'selected' : ''}>
                      <td>{instrument.description}</td>
                      <td>{instrument.number}</td>
                      <td>
                        <button onClick={() => handleSelectInstrument(instrument.description, instrument.number, index)}>Select</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>)}
          </div>
          <div className="submit-section">
            {selectedInstrumentNumber && selectedUserId &&(<button
              type="button"
              onClick={handleSubmitCheckout}
              disabled={!selectedInstrumentNumber || !selectedUserId || !selectedInstrumentDescription}
            >
              Submit Checkout
            </button>)}
          </div>
        </div>
        {showPopup && <PopupMessage 
          message={checkoutMessage} 
          onClose={() => setShowPopup(false)} />}
        {error&& <p>Error: {error}</p>}
      </div>    
      
      
    );
  }
  

export default NewCheckout;
