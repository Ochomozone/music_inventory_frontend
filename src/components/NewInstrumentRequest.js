import React, { useState, useEffect } from 'react';
import {getExistingEquipment } from '../util/helpers';
import PopupMessage from './PopupMessage';
// import { CreateCheckout as CreateNewInstrument } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import '../index.css';
import { RequestInstruments } from '../util/Permissions';

const fetchData = async (baseUrl, data) => {
  try {
    const response = await fetch(`${baseUrl}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed create request');
    }
        return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};

const NewRequest = ({ baseUrl, profile }) => {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const userId = profile ? profile.databaseId : null;
  const [requestData, setRequestData] = useState([]);
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);
  const canRequestInstruments = RequestInstruments(profile);
  


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const equipment = await getExistingEquipment(baseUrl);
        setAvailableEquipment(equipment);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setPopupMessage('Failed to fetch initial data: ', error); 
      }
    };

    fetchInitialData(); 
  }, [baseUrl]);

  const getUniqueRequestId = (userId) => {
    const uniqueId = `${userId}${Math.floor(Math.random() * 1000000000)}`;
    return uniqueId;
    };
    const handleNextButton = () => {
      const existingIndex = requestData.findIndex(request => request.description === description);
    
      if (existingIndex !== -1) {
        const updatedData = [...requestData];
        updatedData[existingIndex].quantity += parseInt(quantity);
        setRequestData(updatedData);
      } else {
        setRequestData([...requestData, { description, quantity: parseInt(quantity) }]);
      }
      setDescription('');
      setQuantity(1);
    };
    

  const handleFetchData = async () => {
    try {
      const data = await fetchData(baseUrl, { 
        userId,
        uniqueId: getUniqueRequestId(userId),
        requestData
      });
      if (data) {
        // onDataFetched(data);
        const { message } = data;
        setPopupMessage(message);
      }
    } catch (error) {
      setPopupMessage('Failed to fetch data', error); // Set error message
    }
  };

  const handleClearFields = async () => {
    setDescription('');
    setPopupMessage(null);
    setRequestData([]);
  };

  

  return (
    <div className="container">
      {canRequestInstruments ? (
        <div>
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
              >
                <option value="">Select Description</option>
                {availableEquipment
                 .sort((a, b) => a.localeCompare(b)) // Sort the array alphabetically
                  .map((equipment, index) => (
            <option key={index} value={equipment}>{equipment}</option>
        ))}
              </select>
            </div>
          </div>
          <div className='container-pair'>
            <div className='left-container'>
              <label htmlFor="quantity">Quantity:</label>
            </div>
            <div className='right-container'>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max="40"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          {description && quantity && (
            <div className='container-pair'>
              <div className='left-container'>
                <button type="button" onClick={handleClearFields}>Clear</button>
              </div>
              <div className='right-container'>
                <button type="button" onClick={handleNextButton}>Add</button>
              </div>
            </div>
          )}
          {requestData && requestData.length > 0 && (
            <div className='container'>
              <h3 className='centered-text'>Request Summary</h3>
              <table className='table'> 
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {requestData.map((request, index) => (
                    <tr key={index}>
                      <td>{request.description}</td>
                      <td>{request.quantity}</td>
                      <td>
                        <button onClick={() => {
                          setRequestData(requestData.filter((_, i) => i !== index))
                        }}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>  
              </table>
            </div>
          )}
          <div className='centered-text'>
            {requestData && requestData.length > 0 && (
              <button 
                onClick={() => {
                  handleFetchData();
                }}
                name="submit"
                type="button"
              >
                Submit
              </button>
            )}
          </div>
          {popupMessage && <PopupMessage message={popupMessage} onClose={() => handleClearFields()} />}
        </div>
      ) : (
        <Unauthorized profile={profile}/>
      )}
    </div>
  );
  
};

export default NewRequest;
