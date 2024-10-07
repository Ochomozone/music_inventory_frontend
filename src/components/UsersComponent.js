import React, { useState, useEffect } from 'react';
import UsersSearch from '../util/UsersSearch';
import '../index.css';
import { ViewUsers } from '../util/Permissions';
import Unauthorized from './Unauthorized';
import { getClasses } from '../util/helpers';
import { useNavigate } from 'react-router-dom';

function UsersComponent({ baseUrl, profile }) {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]); // State for records from JSON upload
  const [searchedUsers, setSearchedUsers] = useState([]); // State for searched users
  const [existingUsers, setExistingUsers] = useState([]); // State for existing users
  
  const [newUsers, setNewUsers] = useState([]); // State for new unmatched users
  const [updatedUsers, setUpdatedUsers] = useState([]); // State for updated users
  const [error, setError] = useState(null); // State for error messages
  const [userClasses, setUserClasses] = useState({}); // Store classes for each user

  // Function to fetch classes and update state
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

  // Fetch classes whenever searchedUsers changes
  useEffect(() => {
    if (searchedUsers.length > 0) {
      fetchUserClasses();
    }
  }, [searchedUsers]);

  const canViewUsers = ViewUsers(profile);
  



  // Fetch the existing users when the component mounts
  useEffect(() => {
    const fetchExistingUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch existing users');
        }
        const data = await response.json();
        setExistingUsers(data); 
      } catch (error) {
        console.error('Error fetching existing users:', error);
      }
    };
    if (canViewUsers) {
      fetchExistingUsers();
    }
  }, [canViewUsers, baseUrl]);

  const handleDataFetched = (data) => {
    setSearchedUsers(data);
  };

  // Call findNewUsers when records are updated
  useEffect(() => {
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
  }, [records, existingUsers]);

  //useEffect to find all existing classes


  useEffect(() => {
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
  }, [records, existingUsers]);

  // Function to handle JSON file upload
  const handleFileUpload = (event) => {
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
  
            setRecords(formattedData); // Set the uploaded records
          } else {
            console.error('Uploaded file does not contain an array');
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file');
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
    const { results, errors } = await createUsers(newUsers, baseUrl); 

    if (errors.length > 0) {
        console.error('Errors occurred while creating users:', errors);
    } else {
        console.log('Successfully created users:', results);
    }
    setNewUsers([]); // Resetting the newUsers array
};

  
  const handleUpdateUsers = async () => {
    const { results, errors } = await updateUsers(updatedUsers, baseUrl);
  
    if (errors.length > 0) {
      console.error('Errors occurred while updating users:', errors);
    } else {
      console.log('Successfully updated users:', results);
    }
    setUpdatedUsers([]);
  };

  const handleClearFields = () => {
    setRecords([]);
    setNewUsers([]);
    setUpdatedUsers([]);
  };
  

  return (
    <div className='container'>
      {canViewUsers ? (
        <div>
          <div className='centered-text'>
            <h1>Users</h1>
          </div>
          <UsersSearch baseUrl={`${baseUrl}`} onDataFetched={handleDataFetched} />

          <div className="upload-container">
            <input type="file" accept="application/json" onChange={handleFileUpload} />
          </div>
          {searchedUsers.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Division</th>
            <th>Grade</th>
            <th>Classes</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {searchedUsers.map((user, index) => {
            const classes = userClasses[user.id] || []; // Get classes for the user

            return (
              <tr key={index}>
                <td>{user.full_name}</td>
                <td>{user.division}</td>
                <td>{user.grade_level}</td>
                <td>
                  {classes.length > 0 ? (
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {classes.map((classItem, i) => (
                      <li key={i}>{classItem}</li>
                    ))}
                  </ul>
                  
                  ) : (
                    <p></p>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/details?databaseId=${user.id}`, { state: { user: user } })}
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}


          {updatedUsers.length > 0 && (
            <div className="table-container">
              <h2>Update ({updateUsers.length +1}) Students</h2>
              <button onClick={handleUpdateUsers}>Update Students</button>
              <table className="table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Grade Level</th> 
                  </tr>
                </thead>
                <tbody>
                  {updatedUsers.map((record, index) => (
                    <tr key={index}>
                      <td>{record.number}</td>
                      <td>{record.lastName}</td>
                      <td>{record.firstName}</td>
                      <td>{record.email}</td>
                      <td>{record.grade_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {newUsers.length > 0 && (
            <div className="table-container">
              <h2>Enter ({newUsers.length }) New Students</h2>
              <button onClick={handleCreateUsers}>Enter New Students</button>
              <table className="table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Grade Level</th> 
                  </tr>
                </thead>
                <tbody>
                  {newUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.number}</td>
                      <td>{user.lastName}</td>
                      <td>{user.firstName}</td>
                      <td>{user.email}</td>
                      <td>{user.grade_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <Unauthorized profile={profile}/>
      )}
    </div>
  );
}

export default UsersComponent;



