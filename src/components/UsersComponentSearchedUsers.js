import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function DisplaySearchedUsers ({users, userClasses, clearPopup}) {
    clearPopup();
    const navigate = useNavigate();
    const [searchedUsers, setSearchedUsers] = useState(users);
    useEffect(() => {
        setSearchedUsers(users);
    }, [users]);
    return (
        <div className='container'> 
        <h2>Matching Users</h2>
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
            const classes = userClasses[user.id] || []; 

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
                    onClick={() => navigate(`/details?databaseId=${user.id}`, { state: { user: user, classes: classes } })}
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
   
        </div>
    )
};
export default DisplaySearchedUsers;