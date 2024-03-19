import React from 'react';
import { useNavigate } from 'react-router-dom';
import PopupMessage from './PopupMessage';
import '../index.css';

const Unauthorized = ({ profile }) => {
    const navigate = useNavigate();
    const role = profile ? profile.role : null;

    const handleClosePopup = () => {
        // Redirect to /home when the popup is closed
        navigate('/');
    };

    return (
        <div>
            <h1>Unauthorized!</h1>
            {role ? (
                <PopupMessage message={`You are not authorized to view this page. You are logged in as a ${role}`} onClose={handleClosePopup} />
            ) : (
                <PopupMessage message="You are not authorized to view this page. Please log in." onClose={handleClosePopup} />
            )}
        </div>
    );
}

export default Unauthorized;
