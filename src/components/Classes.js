import React, { useState, useEffect } from 'react';
import ClassesAddStudents from './ClassesAddStudents';
import ClassesAddInstruments from './ClassesAddInstruments';

const Classes = ({ baseUrl }) => {
  const [existingClasses, setExistingClasses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassStudents, setSelectedClassStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [addStudentsPopup, setAddStudentsPopup] = useState(false);
  const [newClassPopup, setNewClassPopup] = useState(false);
  const [addInstrumentsPopup, setAddInstrumentsPopup] = useState(false);
  const [showAllComponents, setShowAllComponents] = useState(true);
  const [showSelectedClass, setShowSelectedClass] = useState(false);
  const [newClass, setNewClass] = useState({ teacher_id: '', class_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createError, setCreateError] = useState(null);

  
  // Fetch classes and users from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${baseUrl}/classes`);
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setExistingClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${baseUrl}/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setAllUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    fetchUsers();
  }, [baseUrl]);

  // Handle selecting a class and fetching students
  useEffect(() => {
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
        setSelectedClassStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (selectedClass) {
      getStudents(selectedClass);
    }
  }, [selectedClass, baseUrl]);
  
  

  // Function to handle viewing students of a class
  const handleViewClick = (classInfo) => {
    setSelectedClass(classInfo);
  };
  //independent function to set selected class students
    const changeClassStudents = (students) => {
        setSelectedClassStudents(students);
    };

  // Handle form input changes for creating a new class
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setCreateError(null);  // Reset error when input changes
  };

  // Validate and create a new class
  const createNewClass = () => {
    setCreateError(null);
    // Validate inputs
    if (!newClass.teacher_id || !newClass.class_name) {
      setCreateError('Please select a teacher and enter a class name.');
      return;
    }

    // Ensure class name is unique
    const isClassNameUnique = !existingClasses.some(
      (classInfo) => classInfo.class_name.toLowerCase() === newClass.class_name.toLowerCase()
    );
    if (!isClassNameUnique) {
      setCreateError('Class name must be unique.');
      return;
    }

    // Send new class to the backend
    fetch(`${baseUrl}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClass),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create class');
        }
        return response.json();
      })
      .then((data) => {
        setExistingClasses((prevClasses) => [...prevClasses, data]);  
        setNewClass({ teacher_id: '', class_name: '' });  
        setCreateError(null);
      })
      .catch((err) => {
        setCreateError(err.message);
      });
  };

  // Function to get the full name of a teacher
  const teacherName = (teacherId) => {
    const teacher = allUsers.find((user) => user.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
  };

  // Filter music teachers from the users list
  const musicTeachers = allUsers.filter((user) => user.role === 'MUSIC TEACHER');

  //function to remove a user from a class
    const removeUserFromClass = async (baseUrl, student) => {
        const payload = {
            userId: student.user_id,
            classId: selectedClass.id
        };
        try {
            const response = await fetch(`${baseUrl}/classes/students`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Failed to remove student from class');
            } else {
                setSelectedClassStudents((prevStudents) => prevStudents.filter((s) => s.user_id !== student.user_id));
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    // function to handle removing a student from a class
    const handleRemoveStudent = (student) => {
        removeUserFromClass(baseUrl, student);
    };

    const updateClassStudents = (students) => {
      setSelectedClassStudents(students);
    };
   
    const closePopup = () => {
        setShowAllComponents(true);
        setAddStudentsPopup(false);
        setNewClassPopup(false);
        setShowSelectedClass(false);
        setAddInstrumentsPopup(false);
        setError(null);
        setCreateError(null);
    };
    const closeAddStudentsPopup = () => {
        setAddStudentsPopup(false);
        setShowSelectedClass(true);
    };
    const closeAddInstrumentsPopup = () => {
        setAddInstrumentsPopup(false);
        setShowSelectedClass(true);
    };
    const showNewClassPopup = () => {
        setNewClassPopup(true);
        setShowAllComponents(false);
    };
    const showAddStudentsPopup = () => {
        setAddStudentsPopup(true);
        setShowAllComponents(false);
    };
    const showSelectedClassStudents = () => {
        setShowAllComponents(false);
        setShowSelectedClass(true);
    };
    const showAddInstrumentsPopup = (student) => {
        setAddInstrumentsPopup(true);
        setShowAllComponents(false);
    };



  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
       {showAllComponents &&( <div>
      <h2 className='centered-text'>All Classes</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Teacher</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {existingClasses.map((classInfo) => (
            <tr key={classInfo.id}>
              <td>{classInfo.class_name}</td>
              <td>{teacherName(classInfo.teacher_id)}</td>
              <td>
              <button onClick={() => { handleViewClick(classInfo); showSelectedClassStudents(); }}>View Students</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={showNewClassPopup} ><h3>Create New Class</h3></button>
      {createError && <p style={{ color: 'red' }}>{createError}</p>}
      </div>)}
      {newClassPopup &&(<div className='popup'>
        <div className='popup-inner'>  
      <table>
        <tbody>
          <tr>
            <td>
              <label>Teacher:</label>
              <select
                name="teacher_id"
                value={newClass.teacher_id}
                onChange={handleInputChange}
              >
                <option value="">Select a teacher</option>
                {musicTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {`${teacher.first_name} ${teacher.last_name}`}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <label>Class Name:</label>
              <input
                type="text"
                name="class_name"
                value={newClass.class_name}
                onChange={handleInputChange}
                maxLength={30}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {newClass.teacher_id && newClass.class_name && (<button onClick={createNewClass}>Create Class</button>) }
        <button onClick={closePopup}>Close</button>
        </div>
        </div>)}

      {selectedClass && showSelectedClass &&(
        <div className='popup'>
          <div className='centered-text'><button onClick={() => {
                      handleViewClick(selectedClass); 
                      showAddStudentsPopup();    
                          }}>Add Students</button>
          </div>
          <h3>Users in: {selectedClass.class_name}</h3>
          {selectedClassStudents.length > 0 ? (
            <div><table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Grade</th>
                  <th>Instrument</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedClassStudents.map((student) => (
                  <tr key={student.user_id}>
                    <td>
                      <button onClick={() => handleRemoveStudent(student)}>Remove</button>
                    </td>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    <td>{student.grade_level}</td>
                    <td>{student.primary_instrument}</td>
                    <td>
                    <button onClick={() => {
                      setSelectedStudent(student); 
                      showAddInstrumentsPopup();    
                          }}>
                       Assign Instrument
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
            
            
          ) : (
            <p>No students in this class</p>
            
          )}
          
           <div className='centered-text'><button onClick={closePopup}>Close</button></div>
           {addInstrumentsPopup && (
            <ClassesAddInstruments
              baseUrl={baseUrl}
              selectedClass={selectedClass}
              selectedClassStudents={selectedClassStudents}
              updateClassStudents={updateClassStudents}
              student={selectedStudent}
              closeAddInstrumentsPopup={closeAddInstrumentsPopup}
            />
          )}
      
        </div>
      )}
      {addStudentsPopup && (
        <ClassesAddStudents
          baseUrl={baseUrl}
          changeClassStudents={changeClassStudents}
          selectedClass={selectedClass}
          selectedClassStudents={selectedClassStudents}
          closeAddStudentsPopup={closeAddStudentsPopup}
          updateClassStudents={updateClassStudents}
        />
      )}
    </div>
  );
};

export default Classes;
