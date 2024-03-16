import React, { useState } from 'react';

const ReportLostInstrumentForm = ({ itemId, profile, baseUrl, onClose }) => {
  const [name, setName] = useState(profile?.name || '');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/lost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          finderName: name,
          location,
          contact,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to report lost instrument');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error reporting lost instrument:', error.message);
      setMessage('Failed to report lost instrument');
    }

    setSubmitting(false);
  };

  return (
    <div className='container'>
      <h2 className='centered-text'>Report Lost Instrument</h2>
      <form onSubmit={handleSubmit}>
        <div className='container-pair'>
          <div className='left-container'>
          <label htmlFor="name">Your Name:</label>
          </div>
          <div className='right-container'>
          {profile?.name ? (
            <input
              type="text"
              id="name"
              value={name}
              readOnly
            />
          ) : (
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          </div>
          </div>
          <div className='container-pair'>
          <div className='left-container'>
       
          <label htmlFor="location">Current Instrument Location:</label>
          </div><div className='right-container'>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='e.g. MS Office'
            required
          />
          </div>  
        </div>
        <div className='container-pair'>
          <div className='left-container'>
          <label htmlFor="contact">Contact:</label>
          </div>
          <div className='right-container'>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder='e.g. 0700000000 or johndoe@thisemail.com '
            required
          />
          </div>
        </div>
        <div className='container-pair'>
          <div className='left-container'>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          </div><div className='right-container'>
          <button onClick={() => { setMessage(''); onClose(); }}>Close</button>
          </div>
        </div>
      </form>
      {message && (
        <div className="popup">
          <p>{message}</p>
          <button onClick={() => { setMessage(''); onClose(); }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ReportLostInstrumentForm;
