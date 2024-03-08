import React, { useState, useEffect } from 'react';
import '../util/Util.css';

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

const Detail = ({ baseUrl, userName, description, number }) => {
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      const data = await fetchData(baseUrl, userName, description, number);
      if (data) {
        setFetchedData(data);
      }
    };

    fetchDataAndUpdate();
  }, [baseUrl, userName, description, number]);

  return (
    <div>
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
                  <td>{item.created_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Detail;
