import React, { useState } from 'react';
import '../index.css';

const fetchData = async (baseUrl, userName = '') => {
  let url = `${baseUrl}/users`;
  const params = new URLSearchParams();

  if (userName.length > 0) {
    params.append('userName', userName);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  if (!params.toString()) {
    return {};}

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

const UsersSearchSimple = ({ baseUrl, onDataFetched, onClearFields }) => {
  const [userName, setUserName] = useState('');

  const handleFetchData = async () => {
    const data = await fetchData(baseUrl, userName);
    if (data) {
      onDataFetched(data);
    }
  };

  const handleClearFields = async () => {
    onClearFields();
    setUserName('');
  };

  return (
    <div className="container">
      <div className='container-pair'>
      <div className='left-container'>
       <label htmlFor="userName">Name:</label>
      </div>
  <div className='right-container'>
    <input
      type="text"
      id="userName"
      name="userName"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      autoComplete='off'
    />
    </div>
  </div>
  {(userName) &&(<div className='container-pair'>
    <div className='left-container'>
  <button type="button" onClick={handleFetchData}>Search</button>
  </div>
  <div className='right-container'>
  <button type="button" onClick={handleClearFields}>Clear</button>
  </div>
  </div>)}
</div>

  
  );
};

export default UsersSearchSimple;
