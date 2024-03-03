import React, { useState } from 'react';
import './NewCheckout.css';
const fetchCheckoutData = async (baseUrl, description = '', number = '', userId = '') => {
    const url = `${baseUrl}/checkouts`;
    const body = JSON.stringify({ description, number, userId });
    console.log('Body from fetchCheckoutData: ', url, body)

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
    console.log('URL:', url);
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

const fetchInstrumentData = async (baseUrl, instrumentName = '', instrumentNumber = '') => {
    let url = `${baseUrl}/available`;
    const params = new URLSearchParams();
  
    if (instrumentName.length > 0) {
      params.append('description', instrumentName);
    }
    if (instrumentNumber.length > 0) {
      params.append('number', instrumentNumber);
    }
  
    if (params.toString()) {
      url += `?${params.toString()}`;
      console.log('URL:', url);
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

const NewCheckout = ({ baseUrl }) => {
    const [userName, setUserName] = useState('');
    const [userDivision, setUserDivision] = useState('');
    const [classValue, setClassValue] = useState('');
    const [userData, setUserData] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [error, setError] = useState(null);
    const [description, setDescription] = useState('');
    const [number, setNumber] = useState('');
    const [instrumentData, setInstrumentData] = useState([]);
    const [selectedInstrumentDescription, setSelectedInstrumentDescription] = useState('');
    const [selectedInstrumentNumber, setSelectedInstrumentNumber] = useState('');
    const [selectedInstrumentRow, setSelectedInstrumentRow] = useState(null);
  
    const handleUserSearch = async () => {
      try {
        const fetchedUserData = await fetchUserData(baseUrl, userName, userDivision, classValue);
        setUserData(fetchedUserData); 
      } catch (error) {
        setError(error.message);
      }
    };
  
    const handleSelectUser = (userId, index) => {
      setSelectedUserId(userId);
      setSelectedRow(index);
      console.log('Selected user:', userId);
    };

    const handleInstrumentSearch = async () => {
        try {
          const fetchedInstrumentData = await fetchInstrumentData(baseUrl, description, number);
          setInstrumentData(fetchedInstrumentData); 
        } catch (error) {
          setError(error.message);
        }
      };

      const handleSelectInstrument = (instrumentDescription, instrumentNumber, index) => {
        setSelectedInstrumentDescription(instrumentDescription);
        setSelectedInstrumentNumber(instrumentNumber);
        setSelectedInstrumentRow(index);
        console.log('Selected instrument:', instrumentDescription, instrumentNumber);
      };

      const handleSubmitCheckout = async () => {
        try {
          if (!selectedInstrumentNumber || !selectedUserId || !selectedInstrumentDescription) {
            throw new Error('Please select both a user and an instrument');
          }
          const checkoutData = await fetchCheckoutData(
            baseUrl,
            selectedInstrumentDescription,
            selectedInstrumentNumber,
            selectedUserId
          );
          if (!checkoutData) {
            throw new Error('Failed to submit checkout');
          }
      
          setSelectedInstrumentNumber('');
          setSelectedInstrumentDescription('');
          setSelectedUserId('');
      
          setInstrumentData([]);
          setUserData([]);
      
          alert('Checkout submitted successfully');
        } catch (error) {
          console.error('Error submitting checkout:', error.message);
            setError(error.message);
        }
      };
      
  
    return (
        <div className="search-page">
        <div className="container">
          <div className="search-section">
            <div className="search-box">
              <h2>User Search</h2>
              <label htmlFor="userName">
                User Name:
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
                User Division:
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
                Class (optional):
                <input
                  type="text"
                  id="classValue"
                  name="classValue"
                  value={classValue}
                  onChange={(e) => setClassValue(e.target.value)}
                  autoComplete='off'
                />
              </label>
              <button type="button" onClick={handleUserSearch}>Search</button>
            </div>
            <div className="search-results">
              <h2>User Results</h2>
              <table>
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
                        <button onClick={() => handleSelectUser(user.id, index)}>Select</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="instrument-search-section">
            <div className="instrument-search-box">
              <h2>Instrument Search</h2>
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
              <button type="button" onClick={handleInstrumentSearch}>Search</button>
            </div>
            <div className="search-results instrument-search-results">
              <h2>Instrument Results</h2>
              <table>
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
            </div>
          </div>
          <div className="submit-section">
            <button
              type="button"
              onClick={handleSubmitCheckout}
              disabled={!selectedInstrumentNumber || !selectedUserId || !selectedInstrumentDescription}
            >
              Submit Checkout
            </button>
          </div>
        </div>
        {error&& <p>Error: {error}</p>}
      </div>
      
      
    );
  }
  

export default NewCheckout;
