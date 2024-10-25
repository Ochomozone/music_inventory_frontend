// Functions to edit staff room, staff role, and staff division
import React, { useState, useEffect, useCallback } from 'react';
import PopupMessage from '../components/PopupMessage';
const EditStaffForm = ({ staff, baseUrl, onClose, updateStaff }) => {
    const [room, setRoom] = useState(staff?.room || '');
    const [division, setDivision] = useState(staff?.division || '');
    const [role, setRole] = useState(staff?.role || '');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [popup, setPopup] = useState(''); 
    const [addRoom, setAddRoom] = useState(false);
    const [newRoom, setNewRoom] = useState('');
    const [department, setDepartment] = useState('');


    //wrap fetchRooms in a useCallback hook

    const fetchRooms = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/staff/rooms`);
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const data = await response.json();
            const sortedRooms = data.sort((a, b) => a.room.localeCompare(b.room));
            setAvailableRooms(sortedRooms);
        } catch (error) {
            setPopup(`An error occured: ${error.message}`);
            return [];
        }
    }
    , [baseUrl]);

    const departmentsArray = ['ADMIN', 'MS', 'HS', 'ES', 'ADVANCEMENT', 'ART CENTER', 'BUSINESS OFFICE', 'HR', 'TECHNOLOGY', 'LIBRARY', 'OPERATIONS', 'ATHLETICS', 'SECURITY', 'TLC','OTHER'];
    const sortedDepartments = departmentsArray.sort((a, b) => a.localeCompare(b));


    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);
    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!newRoom || !department) {
            setPopup('Room is required');
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/staff/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    room: newRoom.toUpperCase(),
                    department: department,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add room');
            }
            const data = await response.json();
            setAvailableRooms([...availableRooms, data.room]);
            closeAddRoomPopup();
            setPopup(`Room: ${data.room} in ${data.department} added succesfully!`);
        } catch (error) {
            setPopup(`An error occured: ${error.message}`);
        }
    }
     
    const closeAddRoomPopup = () => {
        setAddRoom(false);
        setNewRoom('');
        setDepartment(staff.division);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${baseUrl}/staff`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    staff_number: staff.number,
                    room,
                    division,
                    role,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to edit staff');
            }

            const data = await response.json();
            setMessage(`Staff: ${data.first_name} ${data.last_name} updated successfully!`);
        } catch (error) {
            console.error('Error editing staff:', error.message);
            setMessage('Failed to edit staff', error.message);
        }
        let updatedStaff = { ...staff, room, division, role };
        updateStaff(updatedStaff);
        setSubmitting(false);
        onClose();
    }
    if (popup) {
        return <PopupMessage message={popup} onClose={() => setPopup('')} />;
    }
    return (
        <div className='container'>
        { !addRoom &&<div className='popup'>
            <h2 className='centered-text'>Edit Staff</h2>
            <form onSubmit={handleSubmit}>
                <div className='container-pair'>
                    <div className='left-container'>
                        <label htmlFor="staffNumber">Name:</label>
                    </div>
                    <div className='center-container'>
                        {staff.first_name} {staff.last_name}
                    </div>
                    <div className='right-container'></div>
                </div>
                <div className='container-pair'>
                    <div className='left-container'>
                        <label htmlFor="room">Room:</label>
                    </div>
                    <div className='center-container'>
                        <select
                            id="room"
                            value={room || null}
                            onChange={(e) => setRoom(e.target.value)}
                        >
                            <option value="none">---</option>
                            <option value="">{staff.room? staff.room : 'Select room'}</option>
                            
                            {availableRooms.map((roomOption, index) => (
                                <option key={index} value={roomOption.room}>
                                    {roomOption.room}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='right-container'>
                        <button
                            type="button"
                            onClick={() => setAddRoom(true)}
                        >
                            Add New Room
                        </button>
                    </div>
                </div>
                <div className='container-pair'>
                    <div className='left-container'>
                        <label htmlFor="division">Division:</label>
                    </div>
                    <div className='right-container'>
                        <select
                            id="division"
                            value={division || null}
                            onChange={(e) => setDivision(e.target.value)}
                        >   
                            <option value="none">---</option>
                            <option value="">{staff.division? staff.division: 'Set Division'}</option>
                            {sortedDepartments.map((divisionOption, index) => (
                                <option key={index} value={divisionOption}>
                                    {divisionOption}
                                </option>
                            ))}
                            </select>
                    </div>
                </div>
                <div className='container-pair'>
                    <div className='left-container'>
                        <label htmlFor="role">Role:</label>
                    </div>
                    <div className='right-container'>
                        <input
                            type="text"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                </div>
                <div className='container-pair'>
                <div className='left-container'>
                            <button type="button" onClick={onClose}>Cancel</button>
                            </div>
                    <button className='right-container'type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
                <div className='centered-text'>{message}</div>
            </form>
        </div>}
            {addRoom && (
            <div className='popup'>
                <form onSubmit={handleAddRoom}>
                    <div className='container-pair'>
                        <div className='left-container'>
                            <label htmlFor="addRoom">Department:</label>
                        </div>
                        <div className='center-container'>
                        <select
                            id="room"
                            value={department || null}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">{'Select department'}</option>
                            {sortedDepartments.map((roomOption, index) => (
                                <option key={index} value={roomOption}>
                                    {roomOption}
                                </option>
                            ))}
                        </select>
                        </div>
                    </div>
                    <div className='container-pair'>
                        <div className='left-container'>
                            <label htmlFor="addRoom">New Room:</label>
                        </div>
                        <div className='center-container'>
                            <input
                            type="text"
                            id="addRoom"
                            value={newRoom }
                            onChange={(e) => setNewRoom(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='container-pair'>
                            <div className='left-container'>
                            <button type="button" onClick={closeAddRoomPopup}>Cancel</button>
                            </div>
                            <div className='right-container'>
                                <button type="submit" disabled={!newRoom || !department}>Add Room</button>
                                
                            </div>
                    </div>
                    </form>
                </div>
                    )}
            <button onClick={onClose}>Close</button>
       

    </div>
    )
};
export default EditStaffForm;

