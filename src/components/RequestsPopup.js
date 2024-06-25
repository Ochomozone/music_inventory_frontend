import React from 'react';

export const RequestPopup = ({ reset, sendRequest }) => {
    return (
        <div className="popup">
            <div className='popup-inner'>
           <p>Are you sure you want to send this request?</p>
            <br/>
            <div className="buttons">
                <button onClick={reset}>Cancel</button>
                <button onClick={sendRequest}>Ok</button>
            </div>
        </div>
        </div>
    );
};
