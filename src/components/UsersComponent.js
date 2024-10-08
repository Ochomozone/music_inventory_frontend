import React, { useState, useEffect } from 'react';
import UsersSearch from '../util/UsersSearch';
import '../index.css';
import { ViewUsers } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import { getClasses } from '../util/helpers';
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
  



  // Fetch the existing users when the component mounts
  useEffect(() => {
    setLoading(true);
    const fetchExistingUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/users`);
        if (!response.ok) {
          setPopupMessage('Failed to fetch existing users');
        }
        const data = await response.json();
        setExistingUsers(data); 
      } catch (error) {
        setPopupMessage('Failed to fetch existing users: ' + error.message);
      }
    };
    if (canViewUsers) {
      fetchExistingUsers();
    }
    setLoading(false);
  }, [canViewUsers, baseUrl]);

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
      const newRecords = uploadedRecords.filter(record => !existingUserNumbers.includes(record.number)); 
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
        const existingUser = existingUsers.find(user => user.number === record.number);
        if (existingUser) {
          const existingEmail = existingUser.email ? existingUser.email.toLowerCase() : '';
          const existingFirstName = existingUser.first_name ? existingUser.first_name.toLowerCase() : '';
          const existingLastName = existingUser.last_name ? existingUser.last_name.toLowerCase() : '';
  
          const isEmailChanged = existingEmail !== record.email.toLowerCase();
          const isFirstNameChanged = existingFirstName !== record.firstName.toLowerCase();
          const isLastNameChanged = existingLastName !== record.lastName.toLowerCase();
  
          return isEmailChanged || isFirstNameChanged || isLastNameChanged;
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

  // Function to handle JSON file upload
  const handleFileUpload = (event) => {
    setSearchedUsers([]);
    handleClearFields();
   
    const file = event.target.files[0];
    
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          
          if (Array.isArray(jsonData)) {
            const toTitleCase = (str) => {
              return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
            };
  
            const formattedData = jsonData
              .map(record => {
                const email = record.FIELD4 ? record.FIELD4.toLowerCase() : ""; 
                if (!email) {
                  return null; // Skip the record if email is missing or blank
                }
  
                const emailPrefix = email.split('@')[0];
                const gradeLevelStr = emailPrefix.slice(-2);
                const finishYear = parseInt(gradeLevelStr, 10) + 2000;
  
                const currentYear = new Date().getMonth() < 6 
                  ? new Date().getFullYear() 
                  : new Date().getFullYear() + 1;
  
                return {
                  number: String(record.FIELD1),
                  lastName: toTitleCase(record.FIELD2),
                  firstName: toTitleCase(record.FIELD3),
                  email: email,
                  grade_level: isNaN(finishYear) ? null : 12 - (finishYear - currentYear),
                };
              })
              .filter(record => record !== null); // Filter out null records (where email is missing)
  
            formattedData.sort((a, b) => a.lastName.localeCompare(b.lastName));
            setPopupMessage(`Uploaded ${formattedData.length} records`);
  
            setRecords(formattedData); // Set the uploaded records
          } else {
            setPopupMessage('Uploaded file does not contain an valid records');
          }
        } catch (error) {
          setPopupMessage('Error parsing JSON file: ' + error.message);
        }
      };
      
      reader.readAsText(file);
    } else {
      setPopupMessage('Please upload a valid JSON file');
    }
  };

  const updateUsers = async (data, baseUrl) => {
    const results = [];
    const errors = [];
    for (const record of data) {
      const payload = {
        email: record.email, 
        first_name: record.firstName,  
        last_name: record.lastName,  
        student_number: record.number,  
      };
  
      try {
        const response = await fetch(`${baseUrl}/students`, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), 
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          errors.push({
            record,
            error: errorData || 'Failed to update user.',
            status: response.status,
          });
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

  const createUsers = async (data, baseUrl) => {
    const results = [];
    const errors = [];
    for (const record of data) {
        const payload = {
            email: record.email,
            first_name: record.firstName,
            last_name: record.lastName,
            student_number: record.number,
            grade_level: record.grade_level, 
        };

        try {
            const response = await fetch(`${baseUrl}/students`, {
                method: 'POST', // Use POST for creating new users
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                errors.push({
                    record,
                    error: errorData || 'Failed to create user.',
                    status: response.status,
                });
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
    const { results, errors } = await createUsers(newUsers, baseUrl); 

    if (errors.length > 0) {
        setPopupMessage('Errors occurred while creating users : ' + errors);
    } else {
        setPopupMessage(`Successfully created (${results.length})users :`  );
    }
    setNewUsers([]); // Resetting the newUsers array
    setLoading(false);
};

  
  const handleUpdateUsers = async () => {
    setLoading(true);
    const { results, errors } = await updateUsers(updatedUsers, baseUrl);
  
    if (errors.length > 0) {
      setPopupMessage('Errors occurred while updating users : ' + errors);
    } else {
      // console.log('Successfully updated users:', results);
      setPopupMessage(`Successfully updated (${results.length}) users :`  );
    }
    setUpdatedUsers([]);
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
          <div className='container-pair'>
            <div className="left-container">
              <div><h2>Upload Users</h2>
              <input type="file" accept="application/json" onChange={handleFileUpload} />
              </div>
            </div>
            <div className="right-container">
            <UsersSearch baseUrl={`${baseUrl}`} onDataFetched={handleDataFetched} />
            </div>
          </div>
          {searchedUsers.length > 0 && (
            <DisplaySearchedUsers users={searchedUsers} userClasses={userClasses}  clearPopup={handlePopupClose} />
    )}


          {updatedUsers.length > 0 && (
            <UpdatedUsersTable updatedUsers={updatedUsers} handleUpdateUsers={handleUpdateUsers} clearPopup={handlePopupClose} />
          )}

          {newUsers.length > 0 && (
            <NewUsersTable newUsers={newUsers} handleCreateUsers={handleCreateUsers} clearPopup={handlePopupClose} />
          )}
        </div>
      ) : (
        <Unauthorized profile={profile}/>
      )}
    </div>
  );
}

export default UsersComponent;



