import React, { useState, useEffect } from 'react';
import { ViewLogs } from '../util/Permissions'; 
import Unauthorized from './Unauthorized';
// import '../util/Util.css';
import '../index.css';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchData = async (baseUrl, userName = '', description = '', number = '') => {
  let url = `${baseUrl}/history`;
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

const History = ({ baseUrl, profile }) => {
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [number, setNumber] = useState('');
  const [fetchedData, setFetchedData] = useState(null);
  const canViewLogs = ViewLogs(profile);

  useEffect(() => {
    fetchDataAndUpdate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData]);

  const fetchDataAndUpdate = async () => {
    const data = await fetchData(baseUrl, userName, description, number);
    if (data) {
      setFetchedData(data);
    }
  };

  // const handleFetchData = async () => {
  //   fetchDataAndUpdate();
  // };

  // const handleClearFields = async () => {
  //   setUserName('');
  //   setDescription('');
  //   setNumber('');
  //   fetchDataAndUpdate();
  // };

  return (
    <div >
     {canViewLogs ? ( <div className='container'>
      <div className='container-pair'>
        <div className='left-container'>
        <label htmlFor="description">Description:</label>
      </div>
        <div className='right-container'>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoComplete='off'
        />
      </div>
      </div>
      {description &&(<div className='container-pair'>
        <div className='left-container'>
        <label htmlFor="number">Number:</label>
        </div>
        <div className='right-container'>
        <input
          type="text"
          id="number"
          name="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          autoComplete='off'
        />
        </div>
      </div>)}
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
      <div className="container">
      {(description || number || userName) &&(  <div className='centered-text'>
      {/* <button type="button" onClick={handleFetchData}>Search</button> */}
      {/* <button type="button" onClick={handleClearFields}>Clear</button> */}
      </div>)}
      </div>
      

      {fetchedData && (
        <div className="table-container">
          <table className='table'>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Transaction</th>
                <th>Description</th>
                <th>Number</th>
                <th>Name</th>
                <th>Location</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {fetchedData.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.transaction_timestamp)}</td>
                  <td>{item.transaction_type}</td>
                  <td>{item.description}</td>
                  <td>{item.number}</td>
                  <td>{item.full_name}</td>
                  <td>{item.location}</td>
                  <td>{item.created_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>) : (
        <Unauthorized profile={profile} />
      )}
    </div>
  );
};

export default History;
