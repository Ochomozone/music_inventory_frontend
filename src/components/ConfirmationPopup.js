import React from 'react';

const ConfirmationPopup = ({ message, onCancel, onConfirm }) => {
    return (
        <div className="popup">
            <div className='popup-inner'>
            <p>{message}</p>
            <br/>
            <div className="buttons">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>OK</button>
            </div>
        </div>
        </div>
    );
};

export default ConfirmationPopup;
