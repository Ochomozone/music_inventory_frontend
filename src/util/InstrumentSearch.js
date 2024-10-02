import React, { useState } from 'react';
// import './Util.css';
import '../index.css';

const fetchData = async (baseUrl, number = '', description = '', serialNo = '') => {
    let url = `${baseUrl}`;
    const params = new URLSearchParams();
    
    if (description.length > 0) {
      params.append('description', description);
      
      if (number.length > 0) {
        params.append('number', parseInt(number, 10)); 
      }
    }

    if (serialNo.length >0) {
      params.append('serialNo', serialNo)
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

const InstrumentFetcher = ({ onDataFetched, baseUrl }) => {
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [serialNo, setSerialNo] = useState('');

  const handleFetchData = async () => {
    const data = await fetchData(baseUrl, number, description, serialNo);
    if (data) {
      onDataFetched(data);
    }
  };

  const handleClearFields = async () => {
    // Reset the state
    setNumber('');
    setDescription('');
    setSerialNo('')

    // Fetch all instruments again
    // const data = await fetchData(baseUrl);
    // if (data) {
    //   onDataFetched(data);
    // }
  };

  return (
    <div className="container">
       <div className='container-pair'>
          <div className='left-container'>
            <label htmlFor="InstrumentDescription">Serial Number:</label>
          </div>
          <div className='right-container'>
            <input
              id="InstrumentSerial"
              name="InstrumentSerial"
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
            />
          </div>
        </div>
        <h3 className='centered-text'>Or</h3>
      <div className='container-pair'>
      <div className='left-container'>
        <label htmlFor="InstrumentDescription">Description:</label>
      </div>
        <div className='right-container'>
          <input
            id="InstrumentDescription"
            name="InstrumentDescription"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        </div>
        <div className='container-pair'>
      <div className='left-container'>
        <label htmlFor="InstrumentDescription">Serial Number:</label>
      </div>
        <div className='right-container'>
          <input
            id="InstrumentSerial"
            name="InstrumentSerial"
            type="text"
            value={serialNo}
            onChange={(e) => setSerialNo(e.target.value)}
          />
        </div>
        </div>
        <div className='container-pair'>
      <div className='left-container'>
        <label htmlFor="InstrumentNumber">Number (optional):</label>
      </div>
      <div className='right-container'>
    <input
      id="InstrumentNumber"
      name="InstrumentNumber"
      type="text"
      value={number}
      onChange={(e) => setNumber(e.target.value)}
    />
    </div>
    </div>
    <div className='container-pair'>
      <div className='left-container'>
    <button type="button" onClick={handleFetchData}>Search</button>
    </div>
    <div className='right-container'>
    <button type="button" onClick={handleClearFields}>Clear</button>
    </div>
    </div>
</div>



  );
};

export default InstrumentFetcher;
