import React from 'react';

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <p>{message}</p>
        <br />
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupMessage;