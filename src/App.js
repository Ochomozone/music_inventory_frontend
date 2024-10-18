import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import PopupMessage from './components/PopupMessage';
import LoadingSpinner from './util/LoadingSpinner';
import NavigationBar from './components/NavBar';
import Home from './components/Home';
import Instruments from './components/Instruments';
import Checkouts from './components/Checkout';
import UsersComponent from './components/UsersComponent';
import NewCheckout from './components/NewCheckout';
import NewInstrument from './components/NewInstrument';
import History from './components/History';
import Unauthorized from './components/Unauthorized';
import Detail from './components/Details';
import InstrumentRequests from './components/InstrumentRequests';
import RequestDetails from './components/InstrumentRequestDetails';
import NewRequest from './components/NewInstrumentRequest';
import RequestAdmin from './components/InstrumentRequestAdmin';
import Takestock from './components/StockTaking';
import Classes from './components/Classes';

const baseUrl = 'http://localhost:4001';

function App() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  
  const [isAuthenticating, setIsAuthenticating] = useState(false); 
  const [errorMessage,  setErrorMessage] = useState(null);
  const [timeoutPopup, setTimeoutPopup] = useState(false);
  const navigate = useNavigate();
  const inactivityTimeoutRef = useRef(null); // Using useRef for timeout

  // Google login hook
  const login = useGoogleLogin({
    uxMode: 'redirect',
    onSuccess: (codeResponse) => {
      setIsAuthenticating(true);
      sendTokenToBackend(codeResponse.access_token);
    },
    onError: (error) => setErrorMessage(error)
  });

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      navigate('/');
    }
  }, [navigate]);

  // Function to send the access token to the backend
  const sendTokenToBackend = (accessToken) => {
    fetch(`${baseUrl}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Get the user profile data
        } else {
          setErrorMessage('Failed to authenticate');
          throw new Error('Failed to authenticate with the backend');
        }
      })
      .then(userProfile => {
        // Save access token and profile data
        localStorage.setItem('access_token', accessToken);
        setProfile(userProfile);
        sessionStorage.setItem('profile', JSON.stringify(userProfile));
        setIsAuthenticating(false); // Stop spinner after fetching profile
      })
      .catch(error => {
        console.error('Error during authentication:', error);
        setErrorMessage('Failed to authorise user in database: Contact the app admin');
        setIsAuthenticating(false); // Stop spinner in case of error
      });
  };

  // Function to handle user logout
  const handleLogout = () => {
    googleLogout();
    setProfile(null);
    sessionStorage.removeItem('profile');
    
  };

  // Inactivity timeout logic
  useEffect(() => {
    if (profile) {
      const resetTimeout = () => {
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }

        inactivityTimeoutRef.current = setTimeout(() => {
          setTimeoutPopup(true); 
        }, 30 * 60 * 1000); 
      };

      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keydown', resetTimeout);

      resetTimeout();

      return () => {
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        window.removeEventListener('mousemove', resetTimeout);
        window.removeEventListener('keydown', resetTimeout);
      };
    }
  }, [profile]);

  const closeTimeoutPopup = () => {
    setTimeoutPopup(false);
    handleLogout();
    login();
  };
  if (errorMessage) {
    return (
      <PopupMessage onClose={closeTimeoutPopup} message={errorMessage}/>
    )
  }
  if (timeoutPopup) {
    return (
      <PopupMessage onClose={closeTimeoutPopup} message="You have been inactive for too long. You have been logged out." />
    )
  };

  if (isLoading || isAuthenticating) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {profile && <NavigationBar baseUrl={baseUrl} profile={profile} logOut={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home baseUrl={baseUrl} profile={profile} login={login} logOut={handleLogout} />} />
        {profile && (
          <>
            <Route path="/instruments" element={<Instruments baseUrl={baseUrl} profile={profile} />} />
            <Route path="/checkouts" element={<Checkouts baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/users" element={<UsersComponent baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/newcheckout" element={<NewCheckout baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/newinstrument" element={<NewInstrument baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/history" element={<History baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/unauthorized" element={<Unauthorized profile={profile} />} />
            <Route path="/details/" element={<Detail baseUrl={baseUrl} profile={profile} />} />
            <Route path="/newrequest" element={<NewRequest baseUrl={baseUrl} profile={profile} />} />
            <Route path="/requests" element={<InstrumentRequests baseUrl={baseUrl} profile={profile} />} />
            <Route path="/requestdetails" element={<RequestDetails baseUrl={baseUrl} profile={profile} />} />
            <Route path="/requestadmin" element={<RequestAdmin baseUrl={baseUrl} profile={profile} />} />
            <Route path="/stockcheck" element={<Takestock baseUrl={baseUrl} profile={profile} />} />
            <Route path="/classes" element={<Classes baseUrl={baseUrl} profile={profile} />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
