import React, { useState, useEffect } from 'react';
import '../index.css';
import Unauthorized from './Unauthorized';
import { useLocation } from 'react-router-dom';
import PopupMessage from './PopupMessage';
import ConfirmationPopup from './ConfirmationPopup';
import { useNavigate } from 'react-router-dom';

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



  const fetchData = async (baseUrl, userId = '',   uniqueId = '') => {
    let url = `${baseUrl}/requests`;
    const params = new URLSearchParams();
    
    if (userId.length > 0) {
      params.append('userId', userId);
    }
   
    if (uniqueId.length > 0) {
      params.append('number', uniqueId);
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

  

const InstrumentRequests = ({ profile, baseUrl }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId') || '';
    const [uniqueId, setUniqueId] = useState('');
    const [canCancel, setCanCancel] = useState(false);
    const [message, setMessage] = useState(null); 
    const [showConfirmation, setShowConfirmation] = useState(false);const navigate = useNavigate();

    useEffect(() => {
        const fetchDataFromBackend = async () => {
            const data = await fetchData(baseUrl, userId);
            if (data) {
                setFetchedData(data);
                setCanCancel(parseInt(userId) === profile.databaseId);
            }
        };
        fetchDataFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl, userId, uniqueId]);

    const cancelRequest = async (uniqueId) => {
      const url = `${baseUrl}/requests?uniqueId=${uniqueId}`;
      try {
        const response = await fetch(url, {
          method: 'DELETE',
        });
        if (!response.ok) {
          setMessage('Failed to cancel request');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error canceling request:', error);
        setMessage('Failed to cancel request');
      }
    };

    const handleCancelConfirmation = () => {
      setShowConfirmation(false); // Hide confirmation popup
      cancelRequest(uniqueId); // Call cancelRequest after confirmation
  };

    

    if (!profile) {
        return <Unauthorized profile/>;
      }
      return (
        <div className='container'>
            <div className='centered-text'>
            <h1>Instrument Requests</h1>
            </div>
             <table className='table'>
            <thead>
                <tr>
                    <th>Unique Id</th>
                    <th>Quantity</th>
                    <th>Created At</th>
                    <th>Resolved at</th>
                    <th>Status</th>
                    {canCancel&&(
                    <th>Action</th>
                        )}
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {fetchedData &&
                fetchedData.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
                .map(({ uniqueId, createDate, resolveDate,requestData, userName, attendedBy }) => (
                  <tr key={uniqueId}>
                  <td>{uniqueId}</td>
                  <td>{requestData.quantityRequested}</td>
                  <td>{formatDate(createDate)}</td>
                  <td>{resolveDate !== null ? formatDate(resolveDate) : <p>Unresolved</p>}</td>
                  <td>{requestData.status}</td>
                  
                  <td><button onClick={() => navigate(
            `/requestdetails?uniqueId=${uniqueId}`,
                { state: { createDate: createDate, resolveDate: resolveDate, createdBy: userName, attendedBy: attendedBy }})}>Details</button>
                </td>
                {canCancel && requestData.status=== 'Pending'&&(
                    <React.Fragment>
                    <td>
                        <button onClick={() => {
                            setUniqueId(uniqueId);
                            setShowConfirmation(true); // Show confirmation popup
                        }}>Cancel</button>
                    </td>
                    {showConfirmation && (
                        <ConfirmationPopup
                            message="Are you sure you want to cancel this request?"
                            onCancel={() => setShowConfirmation(false)} // Hide confirmation popup
                            onConfirm={handleCancelConfirmation} // Handle cancellation after confirmation
                        />
                    )}
                </React.Fragment>
                )}
                  
              </tr>
              
                ))}
            </tbody>
            </table> 
            {message && <PopupMessage message={message} onClose={()=>{
              setMessage('');
               setUniqueId('')
               }}/>}
            <div className='centered-text'>
            <button onClick={() => window.history.back()}>Back</button>
            </div>
           
        </div>
      );
      




};

export default InstrumentRequests;