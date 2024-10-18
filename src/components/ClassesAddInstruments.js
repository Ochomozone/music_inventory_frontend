import React, { useState } from 'react';
import PopupMessage from './PopupMessage';
import LoadingSpinner from '../util/LoadingSpinner';
const ClassesAddInstruments = ({ baseUrl, selectedClass, student, closeAddInstrumentsPopup, selectedClassStudents, updateClassStudents }) => {
    const [newInstrument, setNewInstrument] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const addInstrumentToClass = async (baseUrl, instrument) => {
        const payload = {
            classId: selectedClass.id,
            userId: student.user_id,
            instrument
        };
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/classes/instruments`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                setInfoMessage('Failed to add instrument to class');
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
                setLoading(false);
            }
        }
        catch (err) {
            setInfoMessage(`Error: ${err.message}`);
        }
    }
    const handleAddInstrument = (instrument) => {
        addInstrumentToClass(baseUrl, instrument);
        closeAddInstrumentsPopup();
    };
    const handleClose = () => {
        closeAddInstrumentsPopup();
    };
    if (loading) {
        return <LoadingSpinner />;
    };
    if (infoMessage) {
        return <PopupMessage message={infoMessage} closePopup={() => setInfoMessage('')} />;
    };

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