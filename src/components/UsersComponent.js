import React, { useState, useEffect } from 'react';
import UsersSearch from '../util/UsersSearch';
import '../index.css';
import { ViewUsers,  } from '../util/Permissions';
import Unauthorized from './Unauthorized';

function UsersComponent({ baseUrl, profile }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canViewUsers = ViewUsers(profile);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${baseUrl}/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDataFetched = (data) => {
    setUsers(data);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div  className='container'>
      {canViewUsers ?(<div>
      <div className='centered-text'>
      <h1>Users</h1>
      </div>
      <UsersSearch baseUrl={`${baseUrl}/users`} onDataFetched={handleDataFetched} />
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Division</th>
              <th>Grade Level</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.division}</td>
                  <td>{user.grade_level}</td>
                  <td>{user.class}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        </div>) : (
          <Unauthorized profile={profile}/>
        
        )}
    </div>
  );
}

export default UsersComponent;
