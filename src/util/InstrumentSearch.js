import React, { useState } from 'react';
import './Util.css';

const fetchData = async (baseUrl, number = '', description = '') => {
    let url = `${baseUrl}`;
    const params = new URLSearchParams();
    
    if (description.length > 0) {
      params.append('description', description);
      
      if (number.length > 0) {
        params.append('number', parseInt(number, 10)); 
      }
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

  const handleFetchData = async () => {
    const data = await fetchData(baseUrl, number, description);
    if (data) {
      onDataFetched(data);
    }
  };

  const handleClearFields = async () => {
    // Reset the state
    setNumber('');
    setDescription('');

    // Fetch all instruments again
    const data = await fetchData(baseUrl);
    if (data) {
      onDataFetched(data);
    }
  };

  return (
    <div className="container">
      <div>
        <label htmlFor="InstrumentDescription">Description:</label>
      </div>
        <div>
          <input
            id="InstrumentDescription"
            name="InstrumentDescription"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      <div >
        <label htmlFor="InstrumentNumber">Number (optional):</label>
      </div>
      <div>
    <input
      id="InstrumentNumber"
      name="InstrumentNumber"
      type="text"
      value={number}
      onChange={(e) => setNumber(e.target.value)}
    />
    </div>
    <button type="button" onClick={handleFetchData}>Search</button>
    <button type="button" onClick={handleClearFields}>Clear</button>
</div>



  );
};

export default InstrumentFetcher;
