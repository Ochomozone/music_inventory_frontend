import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EditStaffForm from '../util/EditStaffForm';
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

const fetchData = async (baseUrl, userName = '', description = '', number = '', databaseId = '') => {
  let url = `${baseUrl}/history`;
  const params = new URLSearchParams();
  if (databaseId.length > 0) {
    params.append('databaseId', databaseId);
  }
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

const Detail = ({ baseUrl}) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [showStaffForm, setShowStaffForm] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState(location.state.user || null);
  const searchParams = new URLSearchParams(location.search);
  const userName = searchParams.get('userName') || '';
  const databaseId = searchParams.get('databaseId') || '';
  const description = searchParams.get('description') || '';
  const number = searchParams.get('number') || '';
  const instrument = location.state.instrument;
  const classes = location.state.classes;
  const instrumentKeysOrder = ['family', 'description', 'make', 'model', 'serial', 'legacy_code', 'code', 'number', 'state', 'location', 'user_name', 'checkout_date', 'return_date'];
  const userKeysOrder = ['edit details','full_name', 'role', 'email', 'division', 'grade_level', 'room', 'active'];

  const staffList = ['STAFF', 'MUSIC TA', 'MUSIC TEACHER', 'INVENTORY MANAGER', 'FACULTY'];
  const isStaff = (user) => {
    return staffList.includes(user.role);
  };

  const updateStaff = (updatedUser) => {
    setUser(updatedUser);
    setShowStaffForm(false); 
  };

  // if (user && isStaff(user)) {
  //   user = {
  //     ...user, 
  //     'edit details': <button onClick={() => setShowStaffForm(true)}>Edit Details</button>,
  //   };
  // }
 
  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      const data = await fetchData(baseUrl, userName,  description, number, databaseId);
      if (data) {
        setFetchedData(data);
      }
    };

    fetchDataAndUpdate();
  }, [baseUrl, userName,  description, number, databaseId, location.state, user]);

  const handleCloseStaffForm = () => {
    setShowStaffForm(false);
  }

  return (
    <div className='container'>
      <div className='centered-text'>
        <h2>Details</h2>
        
        {showStaffForm && (
          <EditStaffForm
            baseUrl={baseUrl}
            staff={user}
            onClose={handleCloseStaffForm}
            showStaffForm={showStaffForm}
            updateStaff={updateStaff}

          />
        )}
      </div>
      {instrument && (
        <table>
          <tbody>
            {instrumentKeysOrder.map((key, index) => (
              (instrument[key] && (
                <tr className='container-pair' key={index}>
                  <td className='left-container'>
                    {key === 'user_name' ? 'USER NAME' : key === 'description' ? 'TYPE' : key === 'number' ? 'CASE NUMBER' : key.toUpperCase()}:    
                  </td>
                  <td className='right-container' style={{ marginLeft: '10px' }}>
                    {instrument[key]}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
    )}
    {isStaff(user) && (
        <div className='centered-text'><button onClick={() => setShowStaffForm(true)}>Edit Details</button> </div>
      )}

    {user && (
      <table>
        <tbody>
          {userKeysOrder.map((key, index) => (
            (user[key] && (
              <tr className='container-pair' key={index}>
                <td className='left-container'>
                  { key === 'full_name' ? 'NAME' : key === 'grade_level' ? 'GRADE' : key.toUpperCase()}:
                </td>
                <td className='right-container' style={{ marginLeft: '10px' }}>
                  {key === 'active' ? (user[key] ? 'TRUE' : 'FALSE') : user[key]}
                </td>
              </tr>
            ))
          ))}
          {classes && classes.length > 0 && (
            <tr className='container-pair'>
              <td className='left-container'>CLASSES:</td>
              <td className='right-container' style={{ marginLeft: '10px' }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  {classes.map((classItem, i) => (
                    <li key={i}>{classItem}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}


<div className='centered-text'>
        <h2>History</h2>
      </div>

      {(instrument &&fetchedData && fetchedData.length > 0) && (
          <table className='table'>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Transaction</th>
                <th>Name</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {fetchedData.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.transaction_timestamp)}</td>
                  <td>{item.transaction_type}</td>
                  <td>{item.full_name}</td>
                  <td>{item.created_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
       {(user &&fetchedData && fetchedData.length > 0) && (
          <table className='table'>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Transaction</th>
                <th>Description</th>
                <th>Number</th>
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
                  <td>{item.created_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  );
};

export default Detail;
