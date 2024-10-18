import React, { useState, useEffect, useCallback } from 'react';
import UsersSearch from '../util/UsersSearch';
import '../index.css';
import { ViewUsers } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import { getClasses } from '../util/helpers';
import {uploadJson, uploadCsv} from '../util/UploadData';  
import PopupMessage from './PopupMessage';
// import { useNavigate } from 'react-router-dom';
import DisplaySearchedUsers from './UsersComponentSearchedUsers';
import UpdatedUsersTable from './UsersComponentDisplayUpdateUsers';
import NewUsersTable from './UsersComponentNewUsersTable';
import LoadingSpinner from '../util/LoadingSpinner';

function UsersComponent({ baseUrl, profile }) {
  // const navigate = useNavigate();
  const [records, setRecords] = useState([]); // State for records from JSON upload
  const [searchedUsers, setSearchedUsers] = useState([]); // State for searched users
  const [existingUsers, setExistingUsers] = useState([]); // State for existing users
  const [newUsers, setNewUsers] = useState([]); // State for new unmatched users
  const [updatedUsers, setUpdatedUsers] = useState([]); // State for updated users
  const [userClasses, setUserClasses] = useState({}); // Store classes for each user
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [loading, setLoading] = useState(false); // State for loading status
  const [processStaff, setProcessStaff] = useState(false); // State for processing staff

  // Fetch classes whenever searchedUsers changes
  useEffect(() => {
    setLoading(true);
    const fetchUserClasses = async () => {
      const classesData = {};

      await Promise.all(
        searchedUsers.map(async (user) => {
          const classes = await getClasses(baseUrl, user.id);
          classesData[user.id] = classes; // Store classes for each user by their ID
        })
      );

      setUserClasses(classesData); // Update state after fetching all classes
    };

    if (searchedUsers.length > 0) {
      fetchUserClasses();
      setLoading(false);
    }
  }, [searchedUsers, baseUrl]);

  const canViewUsers = ViewUsers(profile);
  
  const fetchExistingUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/users`);
      if (!response.ok) {
        setPopupMessage('Failed to fetch existing users');
        return;
      }
      const data = await response.json();
      setExistingUsers(data); 
    } catch (error) {
      setPopupMessage('Failed to fetch existing users: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Fetch the existing users when the component mounts
  useEffect(() => {
    const initFetchUsers = async () => {
      if (canViewUsers) {
        await fetchExistingUsers();
      }
    };
    initFetchUsers();
  }, [canViewUsers, fetchExistingUsers]);

  const handleDataFetched = (data) => {
    setSearchedUsers(data);
  };

  // Call findNewUsers when records are updated
  useEffect(() => {
    setLoading(true);
    const findNewUsers = (uploadedRecords) => {
      if (existingUsers.length === 0) {
        console.warn('No existing users to compare with.');
        return;
      }
  
      const existingUserNumbers = existingUsers.map(user => user.number); 
      const existingUserEmails = existingUsers.map(user => user.email? user.email.toLowerCase(): '');
      const newRecords = uploadedRecords.filter(record =>( !existingUserNumbers.includes(record.number) && !existingUserEmails.includes(record.email.toLowerCase()))); 
      setNewUsers(newRecords); 
    };
  
    if (records.length > 0) {
      findNewUsers(records);
    }
    setLoading(false);
  }, [records, existingUsers]);

  //useEffect to find all existing classes

  useEffect(() => {
    setLoading(true);
    const findUpdatedUsers = (uploadedRecords) => {
      if (existingUsers.length === 0) {
        console.warn('No existing users to compare with.');
        return;
      }
  
      const updatedRecords = uploadedRecords.filter(record => {
        const existingUser = existingUsers.find(user => user.number && user.number === record.number);
        if (existingUser) {
          const existingEmail = existingUser.email ? existingUser.email.toLowerCase() : '';
          const existingFirstName = existingUser.first_name ? existingUser.first_name.toLowerCase() : '';
          const existingLastName = existingUser.last_name ? existingUser.last_name.toLowerCase() : '';
          const existingGradeLevel = existingUser.grade_level ? existingUser.grade_level : '';
          const existingDivision = existingUser.division ? existingUser.division : '';
          const existingRoom = existingUser.room ? existingUser.room : '';
          const isEmailChanged = existingEmail !== record.email.toLowerCase();
          const isFirstNameChanged = existingFirstName !== record.firstName.toLowerCase();
          const isLastNameChanged = existingLastName !== record.lastName.toLowerCase();
          const isGradeLevelChanged = record.gradeLevel ? existingGradeLevel !== record.gradeLevel : false;
          const isDivisionChanged = record.division ? existingDivision !== record.division : false;
          const isRoomChanged = record.room ? existingRoom !== record.room : false;
          return isEmailChanged || isFirstNameChanged || isLastNameChanged || isGradeLevelChanged || isDivisionChanged || isRoomChanged;
        }
        return false;
      });
  
      setUpdatedUsers(updatedRecords); 
    };
  
    if (records.length > 0) {
      findUpdatedUsers(records);
    }
    setLoading(false);
  }, [records, existingUsers]);

  const handleJsonData = (jsonData) => {
    if (Array.isArray(jsonData)) {
      const toTitleCase = (str) => {
        return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      };
  
      const formattedData = jsonData
        .map(record => {
          const email = typeof record.email === 'string' && record.email
            ? record.email.toLowerCase()
            : "";
  
          if (!email) {
            return null;
          }
  
          const emailPrefix = email.split('@')[0];
          const gradeLevelStr = emailPrefix.slice(-2);
          const finishYear = parseInt(gradeLevelStr, 10) + 2000;
  
          const currentYear = new Date().getMonth() < 6
            ? new Date().getFullYear()
            : new Date().getFullYear() + 1;
          const newGradeLevel = isNaN(finishYear) ? null : 12 - (finishYear - currentYear);
  
          if (processStaff) {
            return {
              number: String(record.number || ""),
              lastName: record.last_name ? toTitleCase(record.last_name) : "",
              firstName: record.first_name ? toTitleCase(record.first_name) : "",
              email: email,
              division: record.division || null,
              role: record.role || 'STAFF',         
              room: record.room || null          
            };
            
          } else {
            return {
              number: String(record.email || ""),
              lastName: record.last_name ? toTitleCase(record.last_name) : "",
              firstName: record.first_name ? toTitleCase(record.first_name) : "",
              email: email,
              grade_level: record.gradeLevel ? record.gradeLevel : newGradeLevel,
              parent1Email: record.parentEmail1 || '',
              parent2Email: record.parentEmail2 || '',
            };
          }
        })
        .filter(record => record !== null); 
      formattedData.sort((a, b) => a.lastName.localeCompare(b.lastName));
      setPopupMessage(`Uploaded ${formattedData.length} records`);
      if (formattedData.length > 0) {
        setRecords(formattedData); 
      } else {
        setPopupMessage('Uploaded file does not contain new or updated records!');
      }
    } else {
      setPopupMessage('Uploaded file does not contain valid records');
    }
  };
  


  // Function to handle JSON file upload
  const handleFileUpload = (event) => {
    setSearchedUsers([]);
    handleClearFields();
   
    const file = event.target.files[0];
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      uploadCsv(file).then((data) => {
        handleJsonData(data);
      }).catch((error) => {
        setPopupMessage(error.message);
      });
    } else if (file.type === 'application/json') {
    uploadJson(file).then((data) => {
      handleJsonData(data);
    }).catch((error) => {
      setPopupMessage(error.message);
    });} else {
      setPopupMessage('Please upload a valid JSON or CSV file');
    };
  };

  const updateUsers = async (data, baseUrl) => {
    const results = [];
    const errors = [];
    for (const record of data) {
      const payload = !processStaff ? {
        email: record.email, 
        first_name: record.firstName,  
        last_name: record.lastName,  
        student_number: record.number,  
        grade_level: record.gradeLevel,
        parent1Email: record.parent1Email,
        parent2Email: record.parent2Email,
      } : {
        email: record.email,
        first_name: record.firstName,
        last_name: record.lastName,
        staff_number: record.number,
        division: record.division,
        role: record.role,
        room: record.room,
      };
  
      try {
        const fetchUrl = !processStaff ? `${baseUrl}/students` : `${baseUrl}/staff`;
        const response = await fetch(fetchUrl, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), 
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to update user : ${record.firstName} ${record.lastName}(status: ${response.status})`);
        } else {
          const resultData = await response.json();
          results.push(resultData);
        }
      } catch (error) {
        errors.push({
          record,
          error: error.message,
        });
        
      }
    }
  
    return { results, errors };
  };

  const createStudents = async (data, baseUrl) => {
    const results = [];
    const errors = [];
    for (const record of data) {
        const payload = {
            email: record.email,
            first_name: record.firstName,
            last_name: record.lastName,
            student_number: record.number,
            grade_level: record.grade_level, 
            parent1Email: record.parent1Email,
            parent2Email: record.parent2Email,
        };

        try {
          if (!record.grade_level || record.grade_level < -1 || record.grade_level > 12) {
            throw new Error(`Invalid grade level for student: ${record.firstName} ${record.lastName}`);
          }
            const response = await fetch(`${baseUrl}/students`, {
                method: 'POST', // Use POST for creating new users
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create user (status: ${response.status})`);
            } else {
                const resultData = await response.json();
                results.push(resultData);
            }
        } catch (error) {
            errors.push({
                record,
                error: error.message,
            });
        }
    }

    return { results, errors };
};

const createStaff = async (data, baseUrl) => {
  const results = [];
  const errors = [];
  for (const record of data) {
      const payload = {
          email: record.email,
          first_name: record.firstName,
          last_name: record.lastName,
          staff_number: record.number,
          division: record.division, 
          role: record.role,
          room: record.room,
      };

      try {
          const response = await fetch(`${baseUrl}/staff`, {
              method: 'POST', // Use POST for creating new users
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Failed to create user (status: ${response.status})`);
          } else {
              const resultData = await response.json();
              results.push(resultData);
          }
      } catch (error) {
          errors.push({
              record,
              error: error.message,
          });
      }
  }

  return { results, errors };
};

const handleCreateUsers = async () => {
    setLoading(true);
    const { results, errors } = processStaff ? await createStaff(newUsers, baseUrl): await createStudents(newUsers, baseUrl); 

    if (errors.length > 0) {
      const messages = errors.map(error => error.error).join(', ') + '\n';
      setPopupMessage(messages);
    }
     else {
        setPopupMessage(`Successfully created (${results.length})users :`  );
    }
    setNewUsers([]); // Resetting the newUsers array
    await fetchExistingUsers(); 
    setLoading(false);
};

  
  const handleUpdateUsers = async () => {
    setLoading(true);
    const { results, errors } = await updateUsers(updatedUsers, baseUrl);
  
    if (errors.length > 0) {
      const messages = errors.map(error => error.error).join(', ') + '\n';
      setPopupMessage(messages);
    } else {
      // console.log('Successfully updated users:', results);
      setPopupMessage(`Successfully updated (${results.length}) users :`  );
    }
    setUpdatedUsers([]);
    await fetchExistingUsers();
    setLoading(false);
  };

  const handleClearFields = () => {
    setRecords([]);
    setNewUsers([]);
    setUpdatedUsers([]);
    setPopupMessage('');
  };
  const handlePopupClose = () => {
    setPopupMessage('');
  };
  const setStaffProperties = () => {
    setProcessStaff(true);
  };
  const setStudentProperties = () => {
    setProcessStaff(false);
  }
  if (loading) {
    return <LoadingSpinner />;
  };
  if (popupMessage) {
    return (
      <PopupMessage message={popupMessage} onClose={handlePopupClose} />
    );
  };


  return (
    <div className='container'>
      {canViewUsers ? (
        <div>
          <div className='centered-text'>
            <h1>Users</h1>
          </div>
          {updatedUsers.length <= 0 && newUsers.length <= 0 &&<div className='container-pair'>
            <div className="left-container">
              
              <div>
              <button onClick={setStaffProperties} disabled = {processStaff}>Process Staff</button>
              <button onClick={setStudentProperties} disabled={!processStaff}>Process Students</button>
               {processStaff?  <h2>Upload Staff File</h2>: <h2>Upload Student File</h2>}
              
              <input type="file" accept="application/json, text/csv" onChange={handleFileUpload} />
              </div>
            </div>
            <div className="right-container">
            <UsersSearch baseUrl={`${baseUrl}`} onDataFetched={handleDataFetched} />
            </div>
          </div>}
          {searchedUsers.length > 0 && (
            <DisplaySearchedUsers users={searchedUsers} userClasses={userClasses} />
    )}


          {updatedUsers.length > 0 && (
            <UpdatedUsersTable updatedUsers={updatedUsers} handleUpdateUsers={handleUpdateUsers} processStaff={processStaff} onCancel={handleClearFields}/>
          )}

          {newUsers.length > 0 && (
            <NewUsersTable newUsers={newUsers} handleCreateUsers={handleCreateUsers}  processStaff={processStaff} onCancel={handleClearFields}/>
          )}
        </div>
      ) : (
        <Unauthorized profile={profile}/>
      )}
    </div>
  );
}

export default UsersComponent;



