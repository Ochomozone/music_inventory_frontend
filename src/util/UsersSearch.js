import React, { useState } from 'react';
import '../index.css';

const fetchData = async (baseUrl, userName = '', userDivision = '', classValue = '') => {
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

const UsersSearch = ({ baseUrl, onDataFetched }) => {
  const [userName, setUserName] = useState('');
  const [userDivision, setUserDivision] = useState('');
  const [classValue, setClassValue] = useState('');

  const handleFetchData = async () => {
    const data = await fetchData(baseUrl, userName, userDivision, classValue);
    if (data) {
      onDataFetched(data);
    }
  };

  const handleClearFields = async () => {
    setUserName('');
    setUserDivision('');
    setClassValue('');

    const data = await fetchData(baseUrl);
    if (data) {
      onDataFetched(data);
    }
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
  <div className='container-pair'>
  <div className='left-container'>
    <label htmlFor="classValue">Class:</label>
  </div>
  <div className='right-container'>
    <input
      type="text"
      id="classValue"
      name="classValue"
      value={classValue}
      onChange={(e) => setClassValue(e.target.value)}
    />
    </div>
  </div>
  <div className='container-pair'>
  <div className='left-container'>
    <label htmlFor="classValue">Division:</label>
  </div>
  <div className= 'right-container'>
    <input
      type="text"
      id="userDivision"
      name="userDivision"
      value={userDivision}
      onChange={(e) => setUserDivision(e.target.value)}
    />
    </div>
  </div>
  {(userName ||userDivision || classValue) &&(<div className='container-pair'>
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

export default UsersSearch;
