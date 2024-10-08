import React from 'react';
function UpdatedUsersTable ({updatedUsers, handleUpdateUsers, clearPopup}) {
    clearPopup();
    console.log('Updated users passed to table component:', updatedUsers);
    // const [users, setUsers] = useState(updatedUsers);
    // useEffect(() => {
    //     setUsers(updatedUsers);
    // }, [updatedUsers]);
    return (
        <div className="table-container">
              <h2>Update ({updatedUsers.length}) Students</h2>
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
    )
};
export default UpdatedUsersTable;

