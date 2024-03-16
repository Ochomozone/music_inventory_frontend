import React, { useState } from 'react';
import ReportLostInstrumentForm from './foundInstrumentForm'; 
import '../index.css';



const fetchData = async (baseUrl, code, number = '', description = '') => {
  let url = `${baseUrl}/instruments`;
  const params = new URLSearchParams();

  if (code.length > 0) {
    const trimmedCode = code.replace(/\s/g, '');

    const [alphaPart, numericPart] = trimmedCode.match(/^([A-Za-z]+)(\d+)$/).slice(1);

    params.append('code', alphaPart);

    const numericValue = parseInt(numericPart, 10);
    params.append('number', numericValue);
  } else {
    if (description.length > 0) {
      params.append('description', description);

      if (number.length > 0) {
        params.append('number', parseInt(number, 10));
      }
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


const InstrumentFetcher = ({ onDataFetched, baseUrl, profile }) => {
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const showUserInfo = profile?.role && ['INVENTORY MANAGER', 'ADMINISTRATOR', 'TEACHER', 'MUSIC TA'].includes(profile.role);
  const [notifyItemId, setNotifyItemId] = useState(null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  

  const handleFetchData = async () => {
    try {
      const data = await fetchData(baseUrl, code, number, description);
      if (data && data.length > 0) {
        setFetchedData(data);
        setFetchError(null);
      } else {
        setFetchedData(null);
        setFetchError('Instrument not found. Confirm your search terms.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setFetchedData(null);
      setFetchError(error.message);
    }
  };

  const handleClearFields = async () => {
    setNumber('');
    setDescription('');
    setCode('');
    setFetchedData(null);
    setFetchError(null);
  };

  const handleNotify = (itemId) => {
    setNotifyItemId(itemId);
    setIsReportFormOpen(true);
  };

  const handleClearReportFormFields = () => {
    setIsReportFormOpen(false);
  };

  return (
    <div className="container">
      <div className='container-pair'>
        <div className='left-container'>
          <label htmlFor="InstrumentCode">Full Code:</label>
        </div>
        <div className='right-container'>
          <input
            id="InstrumentCode"
            name="InstrumentCode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='e.g. AX12'
          />
        </div>
      </div>
      <div className="centered-text">OR</div>
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
          placeholder='e.g. Saxophone'
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
            placeholder='e.g. 12'
          />
        </div>
      </div>
      <div className='container-pair'>
        <div className='left-container'>
      <button type="button" 
              onClick={handleFetchData} 
              disabled={!code && !description && !number}>
              Search
      </button>
      </div>
      <div className='right-container'>

      <button type="button" onClick={handleClearFields}>Clear</button>
      </div>
      </div>

      {fetchError ? (
        <p>{fetchError}</p>
      ) : fetchedData && fetchedData.length > 0 ? (
        <div className='table-container'>
        <table className='table'>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Code</th>
              {showUserInfo && <th>User</th>}
              {showUserInfo && <th>Grade</th>}
              {showUserInfo && <th>Email</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchedData.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.legacy_code} {item.number}</td>
                {showUserInfo && <td>{item.user_name || item.location}</td>}
                {showUserInfo && <td>{item.grade_level}</td>}
                {showUserInfo && <td>{item.email}</td>}
                <td>
                <button onClick={() => handleNotify(item.id)}>Notify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className='centered-text'>Instrument not found. Confirm your search terms.</p>
      )}

      {notifyItemId && isReportFormOpen && (
        <ReportLostInstrumentForm
          itemId={notifyItemId}
          profile={profile}
          baseUrl={baseUrl}
          onClose={() => {
            setNotifyItemId(null);
            handleClearReportFormFields();
          }}
        />
      )}
    </div>
  );
};

export default InstrumentFetcher;
