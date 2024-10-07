import React, { useState } from 'react';
import UserSearchSimple from '../util/UserSearchSimple';

const ClassesAddStudents = ({ baseUrl, selectedClass, selectedClassStudents, changeClassStudents, closeAddStudentsPopup, updateClassStudents }) => {
    const [eligibleUsers, setEligibleUsers] = useState([]);
    const [classStudents, setClassStudents] = useState(selectedClassStudents);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const getStudents = async (selectedClass) => {
          if (!selectedClass || !selectedClass.id) {
            console.error('Invalid class value:', selectedClass?.class_name);
            return;
          }
          setLoading(true);
          setError(null);
      
          try {
            const response = await fetch(`${baseUrl}/classes/students?classId=${selectedClass.id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            if (!response.ok) {
              const errorText = await response.text(); 
              throw new Error(`Failed to fetch students: ${errorText}`);
            }
      
            const data = await response.json();
            setClassStudents(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

    const addStudentToClass = async (baseUrl, student) => {

        const payload = {
            userId: student.id,
            classId: selectedClass.id
        };
        try {
            const response = await fetch(`${baseUrl}/classes/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Failed to add student to class');
            } else {
                getStudents(selectedClass);
                const newEligibleUsers = eligibleUsers.filter((user) => user.id !== student.id);
                updateClassStudents([classStudents]);
                setEligibleUsers(newEligibleUsers);
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    // function to handle adding a student to a class
    const handleAddStudent = (student) => {
        addStudentToClass(baseUrl, student);
    };
    const handleDataFetched = (data) => {
        //filter  data to remove students already in the class
        const studentsInClass = classStudents.map((student) => student.user_id);
        const dataNotInClass = data.filter((student) => !studentsInClass.includes(student.id));
        setEligibleUsers(dataNotInClass);
      };
    const handleClearFields = async () => {
        setEligibleUsers([]);
    };

    const handleClose = () => {
        closeAddStudentsPopup();
        changeClassStudents(classStudents);
    }

    if (loading) {
        return <p>Loading...</p>;
      }
    
      if (error) {
        return <p>Error: {error}</p>;
      }

    return (
        <div className="popup">
            <div className="popup-inner">
            <h2>Add Students to {selectedClass.class_name}</h2>
            <UserSearchSimple baseUrl={`${baseUrl}`} onDataFetched={handleDataFetched} onClearFields={handleClearFields}/>
            {eligibleUsers && eligibleUsers.length > 0 &&(<table className='table'>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Grade Level</th>
                        <th>Add</th>
                    </tr>
                </thead>
                <tbody>
                    {eligibleUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.grade_level}</td>
                            <td>
                                <button className="button" onClick={() => handleAddStudent(user)}>
                                    Add
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>)}
            <button className="close-btn" onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default ClassesAddStudents;
