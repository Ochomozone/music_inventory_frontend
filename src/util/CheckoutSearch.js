import React, { useState } from 'react';

const fetchData = async (baseUrl, userName = '', description = '', number = '') => {
  let url = `${baseUrl}`;
  const params = new URLSearchParams();

  if (userName.length > 0) {
    params.append('userName', userName);
  }
  if (description.length > 0) {
    params.append('description', description);
  }

  if (number.length > 0) {
    params.append('number', number);
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

const CheckoutSearch = ({ onDataFetched, baseUrl }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [number, setNumber] = useState('');

  const handleFetchData = async () => {
    const data = await fetchData(baseUrl, userName, description, number);
    if (data) {
      onDataFetched(data);
    }
  };

  const handleClearFields = async () => {
    // Reset the state
    setUserName('');
    setDescription('');
    setNumber('');

    // Fetch all data again
    const data = await fetchData(baseUrl);
    if (data) {
      onDataFetched(data);
    }
  };

  return (
    <div className="container">
      <div >
        <label htmlFor="userName">Name:</label>
      </div>
      <div >
        <input
          type="text"
          id="userName"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete='off'
        />
      </div>
      <div >
        <label htmlFor="instrumentDescription">Instrument Description :</label>
      </div>
      <div >
        <input
          type="text"
          id="instrumentDescription"
          name="instrumentDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div >
        <label htmlFor="instrumentNumber">Instrument Number :</label>
      </div>
      <div >
        <input
          type="text"
          id="instrumentNumber"
          name="instrumentNumber"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      
    <button type="button" onClick={handleFetchData}>Search</button>
    <button type="button" onClick={handleClearFields}>Clear</button>
 
</div>

  );
};

export default CheckoutSearch;
