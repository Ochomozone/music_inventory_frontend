import React, { useState, useEffect } from 'react';
import UsersSearch from '../util/UsersSearch';
import { ViewUsers } from '../util/Permissions';

function UploadStudentFile({ baseUrl, onDataFetched, onRecordsUpdate, profile }) {
  const [records, setRecords] = useState([]); // State for records from JSON upload
  const [existingUsers, setExistingUsers] = useState([]); // State for existing users
  const [newUsers, setNewUsers] = useState([]); // State for new unmatched users
  const [updatedUsers, setUpdatedUsers] = useState([]); // State for updated users

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
    setRecords(data);
    onDataFetched(data); // Call the parent component's method to handle the fetched data
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

  // Call findUpdatedUsers when records are updated
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
      onRecordsUpdate({ newUsers, updatedUsers }); // Send back updated users and new users to parent
    };

    if (records.length > 0) {
      findUpdatedUsers(records);
    }
  }, [records, existingUsers, newUsers, updatedUsers, onRecordsUpdate]);

  // Function to handle JSON file upload
  const handleFileUpload = (event) => {
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

            handleDataFetched(formattedData); // Set the uploaded records
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

  return (
    <div className="upload-container">
      <input type="file" accept="application/json" onChange={handleFileUpload} />
      <UsersSearch baseUrl={baseUrl} onDataFetched={handleDataFetched} />
    </div>
  );
}

export default UploadStudentFile;
