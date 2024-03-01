import React, { useState } from 'react';

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
    <div>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Number (optional):
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </label>
      <button onClick={handleFetchData}>Search</button>
      <button onClick={handleClearFields}>Clear</button>
    </div>
  );
};

export default InstrumentFetcher;
