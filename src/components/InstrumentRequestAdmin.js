import React, { useState, useEffect } from 'react';
import '../index.css';
import { GrantInstrumentRequests} from '../util/Permissions';
import Unauthorized from './Unauthorized';
import AllInstrumentRequestTable from '../util/AllInstrumentRequestDetailsTable';
import { getAvailableInstruments } from '../util/helpers';

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
    
    useEffect(() => {
        const fetchData = async () => {
          if (!responseData.instrumentData) return; 
          console.log('responseData:', responseData.instrumentData)
      
          try {
            const availableNumbersPromises = responseData.instrumentData.map(async item => {
              const instrumentOptions = await getAvailableInstruments(baseUrl, item.instrument);
              return { [item.instrument]: instrumentOptions };
            });
            const availableNumbersData = await Promise.all(availableNumbersPromises);
            const mergedData = availableNumbersData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            const initialInstrumentChoices = initializeInstrumentChoices(responseData.instrumentData);
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
        setSelectedUniqueId(uniqueId);
        setSelectedCreatorId(responseData.creatorId);
        setSelectedCreatorName(responseData.creatorName);
        setResponseData(responseData);
        console.log('response data from getIndividualRequest:', responseData);
        };

    useEffect(() => {
        const printState = async () => {
        };
        printState();
    }, [selectedCreatorId, instrumentsGranted, selectedId, selectedStatus, selectedSuccess, selectedUniqueId, selectedNotes, attendedBy, attendedById, selectedCreatorName, selectedCreatorId, instrumentsGranted]);

    const initializeInstrumentChoices = (data) => {
        return data.reduce((acc, item) => {
          acc[item.instrument] = Array.from({ length: item.quantity }).map(() => '');
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

        try {
            console.log(`state from admin component: ${selectedId}, ${selectedStatus}, ${selectedSuccess}, ${selectedUniqueId}, ${selectedNotes}, ${attendedBy}, ${attendedById}, ${selectedCreatorName}, ${selectedCreatorId}, ${instrumentsGranted}`)
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
            // resetState();
        }
        catch (error) {
            console.error('Error rejecting request:', error);
        }
        
    };
    const  handleSelectChange = (index, instrument, event) => {
        console.log('index:', index);
        const updatedInstrumentChoices = { ...instrumentChoices };
        updatedInstrumentChoices[instrument][index] = event.target.value;
        setInstrumentChoices(updatedInstrumentChoices);
        console.log('instrumentChoices:', instrumentChoices);
      };

      const selectInstruments = async () => {
        const selectedInstrumentsSet = new Set(); 
        for (const instrument in instrumentChoices) {
            const instrumentIds = instrumentChoices[instrument].filter(id => id !== '');
            instrumentIds.forEach(id => selectedInstrumentsSet.add(id));
        }
        
        const selectedInstruments = Array.from(selectedInstrumentsSet); 
        const success = selectedInstruments.length === 0 ? 'Fail' : totalQuantity - selectedInstruments.length === 0 ? 'Yes' : 'Partial';
        
        setSelectedSuccess(success);
        setInstrumentsGranted(selectedInstruments);
        setSelectedStatus('Resolved');
        
        console.log('selectedInstruments:', selectedInstruments);
        console.log(`state from admin component selectInstruments: selected Id: ${selectedId}, selected Status: ${selectedStatus}, Selected success: ${success}, selected UniqueId:${selectedUniqueId}, selected notes: ${selectedNotes}, selected attended by:${attendedBy},  selected attendedBy id:${attendedById}, creatorName:${selectedCreatorName}, creator Id:${selectedCreatorId}, instruments granted:${selectedInstruments} resolved: ${selectedStatus} success: ${success}`);
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
                                        value={instrumentChoices[item.instrument] && instrumentChoices[item.instrument][i]}
                                        onChange={(event) => handleSelectChange(i, item.instrument, event)}
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
                    <tr><td colSpan={2}> <button onClick={selectInstruments}>Confirm Selection</button></td></tr>
                </tbody>
            </table>
           
        </div>
    )}

        </div>
      );
      
    };
  export default RequestAdmin;
