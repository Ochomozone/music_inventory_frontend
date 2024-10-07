import React, { useState } from 'react';
const ClassesAddInstruments = ({ baseUrl, selectedClass, student, closeAddInstrumentsPopup, selectedClassStudents, updateClassStudents }) => {
    const [newInstrument, setNewInstrument] = useState('');
    const addInstrumentToClass = async (baseUrl, instrument) => {
        const payload = {
            classId: selectedClass.id,
            userId: student.user_id,
            instrument
        };
        try {
            const response = await fetch(`${baseUrl}/classes/instruments`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Failed to add instrument to class');
            } else {
                const newStudent = student
                newStudent.primary_instrument = instrument.toUpperCase();
                //update the student in selectedClassStudents
                const updatedStudents = selectedClassStudents.map((student) => {
                    if (student.user_id === newStudent.user_id) {
                        return newStudent;
                    }
                    return student;
                });
                updateClassStudents(updatedStudents);
                setNewInstrument('');
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    const handleAddInstrument = (instrument) => {
        addInstrumentToClass(baseUrl, instrument);
        closeAddInstrumentsPopup();
    };
    const handleClose = () => {
        closeAddInstrumentsPopup();
    }
    return (
        <div className='popup'>
            <div className='popup_inner'>
                <h2>Set Instrument for {student.first_name} {student.last_name}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleAddInstrument(newInstrument);
                }}>
                    <label>
                        Instrument:
                        <input type='text' value={newInstrument} onChange={(e) => setNewInstrument(e.target.value)} />
                    </label>
                </form>
                {newInstrument && <button onClick={() => handleAddInstrument(newInstrument)}>Add Instrument</button>}
                <button onClick={handleClose}>Close</button>
            </div>
        </div>
    );
}
export default ClassesAddInstruments;