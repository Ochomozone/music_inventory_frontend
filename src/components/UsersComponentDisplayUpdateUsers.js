import React from 'react';
function UpdatedUsersTable ({updatedUsers, handleUpdateUsers, processStaff, onCancel}) {
    // const [users, setUsers] = useState(updatedUsers);
    // useEffect(() => {
    //     setUsers(updatedUsers);
    // }, [updatedUsers]);
    const updateUsers = () => {
      handleUpdateUsers();
    };
    return (
        <div className="table-container">
              {processStaff ? <h2>Update ({updatedUsers.length})Staff Member/s </h2> : <h2>Update ({updatedUsers.length}) Student/s</h2>}
              <button onClick={updateUsers}>Save</button>
              <button onClick={onCancel}>Clear Uploaded Data</button>
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

