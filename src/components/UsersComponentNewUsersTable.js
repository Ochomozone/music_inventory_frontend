import React from "react";
function NewUsersTable({ newUsers, handleCreateUsers, clearPopup }) {
    clearPopup();
    return (
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
    )
};
export default NewUsersTable;