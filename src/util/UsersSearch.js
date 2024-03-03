import React, { useState } from 'react';

const fetchData = async (baseUrl, userName = '', userDivision = '', classValue = '') => {
  let url = `${baseUrl}`;
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
    // Reset the state
    setUserName('');
    setUserDivision('');
    setClassValue('');

    // Fetch all data again
    const data = await fetchData(baseUrl);
    if (data) {
      onDataFetched(data);
    }
  };

  return (
    <div>
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
      <button type="button" onClick={handleFetchData}>Search</button>
      <button type="button" onClick={handleClearFields}>Clear</button>
    </div>
  );
};

export default UsersSearch;
