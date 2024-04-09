import React, { useState, useEffect } from 'react';
import '../index.css';
import Unauthorized from './Unauthorized';
import { useLocation } from 'react-router-dom';
import TableComponent from '../util/InstrumentDetailsRequestTable';

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

  const fetchData = async (baseUrl,  uniqueId = '') => {
    let url = `${baseUrl}/requests`;
    const params = new URLSearchParams();
    if (uniqueId.length > 0) {
      params.append('uniqueId', uniqueId);
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

  const RequestDetails = ({ profile, baseUrl }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uniqueId = searchParams.get('uniqueId') || '';
    const createDate = location.state.createDate;
    const resolveDate = location.state.resolveDate;
    const prev_attended_by = location.state.attended_by;
    const createdBy = location.state.createdBy;
    const attendedBy = profile ? profile.name : '';

    useEffect(() => {
        const fetchDataFromBackend = async () => {
            console.log('state:', location.state);
            const data = await fetchData(baseUrl, uniqueId);
            if (data) {
                setFetchedData(data);
            }
        };
        fetchDataFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl, uniqueId]);
    if (!profile) {
        return <Unauthorized profile/>;
      }

      return (
        <div className='container'>
            <h1  className='centered-text'>Request Details</h1>
            {fetchedData && (
                <div className='container'>
                <h2 className='centered-text'>Request ID: {fetchedData.uniqueId}</h2>
                <p  className='centered-text'>Requested on: {formatDate(createDate)}</p>
                <p  className='centered-text'>Resolved on: {resolveDate ? formatDate(resolveDate) : 'Not resolved'}</p>
                <p  className='centered-text'>Created By: {createdBy}</p>
                {prev_attended_by &&(<p  className='centered-text'>Attended By: {attendedBy}</p>)}
                {(prev_attended_by && (
                    <p  className='centered-text'>Created By: {createdBy}</p>
                ))}
                <br />
               {fetchedData.notes &&( <p className='centered-text'>Notes: {fetchedData.notes}</p>)}
                <div className='container'>
                    <h2 className='centered-text'>Instruments Granted</h2>
                    <div className='container-pair'>
                    <div className='leftt-container'>
                      <h3 className='centered-text'>Request Summary</h3>
                    <table className='table'>
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Quantity Granted</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fetchedData.requestData.map(({ description, quantity, instruments_granted }) => (
                            <tr key={description}>
                            <td>{description}</td>
                            <td>{quantity}</td>
                            <td>{instruments_granted ? instruments_granted.length : 0}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                      <div className='right-container'>
                        <div className='container' style={{ marginLeft: '30px' }}>
                      <h3 className='centered-text'>Response Details</h3>
                    <TableComponent data={fetchedData.requestData} />
                    </div>
                    </div>
                    
                  </div>
                </div>
                </div>
            )}
            <div className='centered-text'>
            <button onClick={() => window.history.back()}>Back</button>
            </div>
        </div>
        
      );
  };

  export default RequestDetails;