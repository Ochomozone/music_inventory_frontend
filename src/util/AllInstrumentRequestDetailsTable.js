import React, {useState, useEffect} from 'react';
import { ViewAllInstrumentRequests, GrantInstrumentRequests } from './Permissions';
import { useNavigate } from 'react-router-dom';
function AllInstrumentRequestTable({ requestData, profile, getIndividualRequest, rejectRequest }) {
    const navigate = useNavigate();
    const [createNotes, setCreateNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [creatorId, setCreatorId] = useState('');
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
    const canViewAllInstrumentRequests = ViewAllInstrumentRequests(profile);
    const canGrant = GrantInstrumentRequests(profile);
    // Function to calculate total quantity
    const calculateTotalQuantity = (instrumentData) => {
        return instrumentData.reduce((acc, curr) => acc + curr.quantity, 0);
    };
    useEffect(() => {
      }, [uniqueId]);

    const resetState = () => {
        setNotes('');
        setCreateNotes(false);
        setUniqueId('');
        setCreatorName('');
        setCreatorId('');
        
        };

    const handleInputChange = (event) => {
        setNotes(event.target.value);
      };
    
      const handleCancelClick = () => {
        resetState();
      };
    
      const handleSubmitClick = async () => {
       rejectRequest(uniqueId, notes, creatorName, creatorId);
       setCreateNotes(false);
        
      };

      


      return (
        <div className='container'>
          {canViewAllInstrumentRequests && (
            <div className='container'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Creator Name</th>
                    <th>Created at</th>
                    <th>Status</th>
                    <th>Quantity</th>
                    <th>Details</th>
                    {canGrant && <th>Reject</th>}
                    {canGrant && <th>Attend</th>}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(requestData).sort((a, b) => new Date(requestData[a].created_at) - new Date(requestData[b].created_at))
                  .map((uniqueId) => {
                    const {
                      creatorName,
                      creatorId,
                      created_at,
                      resolved_at,
                      attended_by,
                      status,
                      instrumentData,
                    } = requestData[uniqueId];
      
                    const totalQuantity = calculateTotalQuantity(instrumentData);
      
                    return (
                      <tr key={uniqueId}>
                        <td>{creatorName}</td>
                        <td>{formatDate(created_at)}</td>
                        <td>{status}</td>
                        <td>{totalQuantity}</td>
                        <td>
                          <button
                            onClick={() => navigate(`/requestdetails?uniqueId=${uniqueId}`, {
                              state: {
                                createDate: created_at,
                                resolveDate: resolved_at,
                                createdBy: creatorName,
                                creatorName,
                                creatorId,
                                attendedBy: attended_by
                              }
                            })}
                          >
                            Details
                          </button>
                        </td>
                        {canGrant && (
                          <td>
                            <button
                              disabled={status !== 'Pending'}
                              onClick={() => {
                                setCreateNotes(true);
                                setUniqueId(uniqueId);
                                setCreatorName(creatorName);
                                setCreatorId(creatorId);
                              }}
                            >
                              Reject
                            </button>
                          </td>
                        )}
                        {canGrant && (
                          <td>
                            <button
                              disabled={status !== 'Pending'}
                              onClick={() => {
                                setCreateNotes(false);
                                getIndividualRequest(uniqueId, requestData[uniqueId]);
                              }}
                            >
                              Attend
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
      
              {createNotes && (
                <div className="form-container">
                  <form>
                    <label htmlFor="notes">Enter notes:</label>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={handleInputChange}
                    />
      
                    <div className="button-container">
                      <button
                        type="button"
                        className="button"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="button"
                        onClick={handleSubmitClick}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      );
      
}

export default AllInstrumentRequestTable;
