import React, { useState } from 'react';
// import './SwapCasePopup.css'; 

const SwapCasePopup = ({ description, code, itemId1, number1, onClose, onSwap }) => {
  const [number2, setNumber2] = useState('');

  const handleSwap = () => {
    onSwap(description, code, itemId1, number1, number2);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Swap Cases</h2>
        <div>
          <label>{description} Number:</label>
          <span>{number1}</span>
        </div>
        <div>
          <label>Swap With {description} (Number):</label>
          <input
            type="number"
            value={number2}
            onChange={(e) => setNumber2(e.target.value)}
          />
        </div>
        <div className="button">
          <button onClick={handleSwap}  disabled={!number2}>Swap</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SwapCasePopup;
