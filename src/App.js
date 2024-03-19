import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import NavigationBar from './components/NavBar';
import Home from './components/Home';
import Instruments from './components/Instruments';
import Checkouts from './components/Checkout';
import UsersComponent from './components/UsersComponent';
import NewCheckout from './components/NewCheckout';
import NewInstrument from './components/NewInstrument';
import History from './components/History';
import Unauthorized from './components/Unauthorized';

const baseUrl = 'http://localhost:4001';

function App() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Google login hook
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // Send the codeResponse to the backend to get the user profile
      sendTokenToBackend(codeResponse.access_token);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Function to send the access token to the backend
  const sendTokenToBackend = (accessToken) => {
    fetch(`${baseUrl}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    })
    .then(response => {
      if (response.ok) {
        // Save the access token in local storage
        localStorage.setItem('access_token', accessToken);
        fetchUserProfile();
      } else {
        console.error('Failed to send access token to the backend');
      }
    })
    .catch(error => {
      console.error('Error sending access token:', error);
    });
  };

  // Function to fetch user profile from the backend
  const fetchUserProfile = () => {
    fetch(`${baseUrl}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch user profile');
      }
    })
    .then(data => {
      setProfile(data);
      sessionStorage.setItem('profile', JSON.stringify(data));
    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
    });
  };

  // Function to handle user logout
  const handleLogout = () => {
    googleLogout();
    setProfile(null);
    navigate('/');
    sessionStorage.removeItem('profile');
  };

  return (
    <div>
      {profile && <NavigationBar baseUrl={baseUrl} profile={profile} logOut={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home baseUrl={baseUrl} profile={profile} login={login} logOut={handleLogout} />} />
        {profile && (
          <>
            <Route path="/instruments" element={<Instruments baseUrl={baseUrl} profile={profile} />} />
            <Route path="/checkouts" element={<Checkouts baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/users" element={<UsersComponent baseUrl={`${baseUrl}`} profile={profile}/>} />
            <Route path="/newcheckout" element={<NewCheckout baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/newinstrument" element={<NewInstrument baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/history" element={<History baseUrl={baseUrl} profile={profile}/>} />
            <Route path="/unauthorized" element={<Unauthorized profile={profile} />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
