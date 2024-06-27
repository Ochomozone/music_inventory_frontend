import React, { useState, useEffect } from 'react';
import '../index.css';
import { GrantInstrumentRequests} from '../util/Permissions';
import Unauthorized from './Unauthorized';
import AllInstrumentRequestTable from '../util/AllInstrumentRequestDetailsTable';
import { getAvailableInstruments } from '../util/helpers';
import {RequestPopup} from './RequestsPopup';

  const fetchData = async (baseUrl) => {
    
    try {
      const response = await fetch(`${baseUrl}/requests`);
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
  

  const RequestAdmin = ({ profile, baseUrl }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const [responseData, setResponseData] = useState([]);
    const canGrant = GrantInstrumentRequests(profile);
    const [selectedId, setSelectedId] = useState('');
    const [selectedUniqueId, setSelectedUniqueId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSuccess, setSelectedSuccess] = useState('');
    const [instrumentsGranted, setInstrumentsGranted] = useState([]); 
    const [selectedNotes, setSelectedNotes] = useState('');
    const attendedBy= profile.name;
    const attendedById = profile.databaseId;
    const [selectedCreatorName, setSelectedCreatorName] = useState('');
    const [selectedCreatorId, setSelectedCreatorId] = useState('');
    const [instrumentOptions, setInstrumentOptions] = useState([]);
    const [instrumentChoices, setInstrumentChoices] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [selectedInstrumentChoices, setSelectedInstrumentChoices] = useState([{}]);
    
    useEffect(() => {
        const fetchData = async () => {
          if (!responseData.instrumentData) return; 
      
          try {
            const availableNumbersPromises = responseData.instrumentData.map(async item => {
              const instrumentOptions = await getAvailableInstruments(baseUrl, item.instrument);
              return { [item.instrument]: instrumentOptions };
            });
            const availableNumbersData = await Promise.all(availableNumbersPromises);
            const mergedData = availableNumbersData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            const initialInstrumentChoices = initializeInstrumentChoices(responseData.instrumentData);
            Object.keys(initialInstrumentChoices).forEach(requestId => {
                const instrumentsObject = initialInstrumentChoices[requestId];
                if ('requestId' in instrumentsObject) {
                    delete instrumentsObject.requestId;
                }
            });
            
            setInstrumentChoices(initialInstrumentChoices);
            setInstrumentOptions(mergedData);
            const totalQuantity = responseData.instrumentData.reduce((acc, curr) => acc + curr.quantity, 0);
            setTotalQuantity(totalQuantity);
          } catch (error) {
            console.error('Error fetching available numbers:', error);
          }
        };
      
        fetchData();
      }, [baseUrl, responseData.instrumentData]);

    const getIndividualRequest = async (uniqueId, responseData) => {
        resetState();
        setSelectedUniqueId(uniqueId);
        setSelectedCreatorId(responseData.creatorId);
        setSelectedCreatorName(responseData.creatorName);
        setResponseData(responseData);
        };

    useEffect(() => {
        const printState = async () => {
        };
        printState();
    }, [selectedCreatorId, instrumentsGranted, selectedId, selectedStatus, selectedSuccess, selectedUniqueId, selectedNotes, attendedBy, attendedById, selectedCreatorName, selectedCreatorId, instrumentsGranted]);

    const initializeInstrumentChoices = (data) => {
        return data.reduce((acc, item) => {
            acc[item.requestId] = {
                [item.instrument]: Array.from({ length: item.quantity }).map(() => ''),
                requestId: item.requestId
            };
            return acc;
        }, {});
    };
    const rejectRequest = async (uniqueId, notes, creatorName, creatorId) => {
        setSelectedUniqueId(uniqueId);
        setSelectedStatus('Resolved');
        setSelectedSuccess('Fail');
        setSelectedNotes(notes);
        setSelectedCreatorName(creatorName);
        setSelectedCreatorId(creatorId);
        setShowConfirmationPopup(false);

        try {
            const response = await fetch(`${baseUrl}/requests`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedId, 
                    selectedStatus: 'Resolved', 
                    selectedSuccess: 'Fail', 
                    uniqueId, 
                    notes, 
                    attendedBy, 
                    attendedById, 
                    creatorName, 
                    creatorId, 
                    instrumentsGranted  }),
            });
            if (!response.ok) {
                throw new Error('Failed to reject request');
            }
            const data = await response.json();
            if (data) {
                resetState();
            }
        }
        catch (error) {
            console.error('Error rejecting request:', error);
        }
        
    };
    const  handleSelectChange = (index, requestId, instrument, event) => {
        const updatedInstrumentChoices = { ...instrumentChoices };
        updatedInstrumentChoices[requestId][instrument][index] = event.target.value;
        setInstrumentChoices(updatedInstrumentChoices);
      };

      const selectInstruments = async () => {
        const selectedInstrumentChoices = {}; 
        for (const requestId in instrumentChoices) {
            const choice = instrumentChoices[requestId];
            const selectedIdsSet = new Set();
            for (const key in choice) {
                const instrumentIds = choice[key];
                instrumentIds.forEach(id => {
                    if (id !== null && id !== '') {
                        selectedIdsSet.add(id);
                    }
                });
            }
           if (selectedIdsSet.size>0) {selectedInstrumentChoices[requestId] = [...selectedIdsSet];}
        }
        for (const key in selectedInstrumentChoices) {
            if (!selectedInstrumentChoices[key].length) {
                delete selectedInstrumentChoices[key];
            }}
        
        setSelectedInstrumentChoices(selectedInstrumentChoices);
        const filteredInstruments = Object.values(selectedInstrumentChoices)
            .flat() 
            .filter(instrument => instrument !== null && instrument !== '');
        const success = filteredInstruments.length === 0 ? 'Fail' : totalQuantity - filteredInstruments.length === 0 ? 'Yes' : 'Partial';
        const resolved = 'Resolved'
        const notes = success === 'Yes'? 'Your Instruments are ready for collection': 'We do not have enough instruments to service your request at this time';
        
        setSelectedSuccess(success);
        setInstrumentsGranted(filteredInstruments);
        setSelectedStatus(resolved);
        setSelectedNotes(notes);
        setShowConfirmationPopup(true);
    };

    useEffect(() => {
        if (showConfirmationPopup) {
            sendRequest();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showConfirmationPopup]);

    const sendRequest = async () => {
        for ( const requestId in selectedInstrumentChoices) {
            const response = await fetch(`${baseUrl}/requests`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: requestId, 
                    status: selectedStatus, 
                    success: selectedSuccess, 
                    uniqueId: selectedUniqueId, 
                    notes: selectedNotes, 
                    attendedBy, 
                    attendedById, 
                    creatorName: selectedCreatorName, 
                    creatorId: selectedCreatorId, 
                    instrumentsGranted: selectedInstrumentChoices[requestId] }),
            });
            if (!response.ok) {
                console.log('error:', response);
                throw new Error('Failed to send request');
            }
           
        }
        resetState();
    };
    

    
    
    const resetState = () => {
        setSelectedId('');
        setSelectedUniqueId('');
        setSelectedStatus('');
        setSelectedSuccess('');
        setSelectedNotes('');
        setSelectedCreatorName('');
        setSelectedCreatorId('');
        setInstrumentsGranted([]);
        setShowConfirmationPopup(false);
        
    };


    useEffect(() => {
        const fetchDataFromBackend = async () => {
            const data = await fetchData(baseUrl);
            if (data) {
                setFetchedData(data);
                setResponseData([])
            }
        };
        fetchDataFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCreatorId]);

    if (!profile) {
        return <Unauthorized profile/>;
      }

      return (
        <div className='container'>
          {canGrant && (
            <div className='container'>
              <h1 className='centered-text'>Requests</h1>
              {fetchedData && (
                <div className='container'>
                  <AllInstrumentRequestTable 
                    requestData={fetchedData} 
                    profile={profile} 
                    getIndividualRequest={getIndividualRequest}
                    rejectRequest={rejectRequest} 
                  />
                </div>
              )}
            </div>
          )}
      
      {canGrant && responseData && responseData.instrumentData && (
        <div className='container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Assign</th>
                        <th>Number Assigned</th>
                    </tr>
                </thead>
                <tbody>
                    {responseData.instrumentData.map((item, index) => (
                        Array.from({ length: item.quantity }).map((_, i) => (
                            <tr key={i}>
                                <td>{item.instrument}</td>
                                <td>
                                    <select 
                                        value={instrumentChoices[item.requestId] && instrumentChoices[item.requestId][item.instrument][i]}
                                        onChange={(event) => handleSelectChange(i, item.requestId, item.instrument, event)}
                                    >
                                        <option value="">Select Number</option>
                                        {instrumentOptions[item.instrument]?.map((instrument, idx) => (
                                            <option key={idx} value={instrument.id}>{instrument.number}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))
                    ))}
                    <tr><td colSpan={2}> <button onClick={selectInstruments}>Submit</button></td></tr>
                </tbody>
            </table>
            {showConfirmationPopup && (
                <RequestPopup 
                    reset={resetState} 
                    sendRequest={sendRequest} 
                />
            )}
           
        </div>
    )}

        </div>
      );
      
    };
  export default RequestAdmin;
