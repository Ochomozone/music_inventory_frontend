import React, { useState } from 'react';
import axios from 'axios';

const LostAndFoundSearch = ({ baseUrl, itemId, profile }) => {
  const [popupMessage, setPopupMessage] = useState('');

  const searchLostAndFound = async () => {
    try {
      const response = await axios.get(`${baseUrl}/lost`, {
        params: {
          itemId
        }
      });

      if (response.data.length > 0) {
        const foundItem = response.data[0];
        const message = `Your instrument was found by ${foundItem.finder_name} 
                          on ${new Date(foundItem.date).toLocaleDateString()} and 
                          is in ${foundItem.location}.`;
         const altMessage = `Instrument was found by ${foundItem.finder_name} 
                          on ${new Date(foundItem.date).toLocaleDateString()} and 
                          is in ${foundItem.location}. 
                          Contact them at ${foundItem.contact}.`;
        if (profile) {setPopupMessage(message)} else {setPopupMessage(altMessage)};
      } else {if (profile) {
        setPopupMessage(`Your instrument has not been found by anyone yet. 
        Check the last place you remember having it. 
        If you still can't find it, report it  to the ${profile.division} office.
        In the meantime Keep checking here regularly`);
      } else {
        setPopupMessage("Instrument has not been found by anyone yet.");
      }
      }
    } catch (error) {
      console.error('Error searching lost and found:', error);
      setPopupMessage('An error occurred while searching lost and found.');
    }
  };

  const handleSearchClick = () => {
    searchLostAndFound();
  };

  return (
    <div>
      <button onClick={handleSearchClick}>Ask Around</button>
      {popupMessage && (
        <div className="popup">
          <span className="popup-message">{popupMessage}</span>
          <button onClick={() => setPopupMessage('')}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LostAndFoundSearch;
