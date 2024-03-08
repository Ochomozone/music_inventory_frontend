import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Instruments from './components/Instruments';
import Checkouts from './components/Checkout';
import UsersComponent from './components/UsersComponent';
import NewCheckout from './components/NewCheckout';
import History from './components/History';

const baseUrl = 'http://localhost:4001';

function App() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic
  };

  const handleLogin = async (googleResponse) => {
    try {
      const idToken = googleResponse.getAuthResponse().id_token;

      // Send the id_token to your backend
      const userInfo = await sendIdTokenToBackend(idToken);
      setProfile(userInfo);
      sessionStorage.setItem('profile', JSON.stringify(userInfo));
      navigate('/instruments');
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const sendIdTokenToBackend = async (idToken) => {
    try {
      const response = await axios.post(`${baseUrl}/auth`, { idToken });
      return response.data;
    } catch (error) {
      console.error('Error sending id_token to backend:', error);
      throw new Error('Failed to send id_token to backend');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/profile`);
        setProfile(response.data);
        sessionStorage.setItem('profile', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <NavigationBar baseUrl={baseUrl} profile={profile} logOut={handleLogout} />
      <Routes>
        <Route path="/" element={<Home profile={profile} login={handleLogin} logout={handleLogout} />} />
        {profile && (
          <>
            <Route path="/instruments" element={<Instruments baseUrl={`${baseUrl}/instruments`} />} />
            <Route path="/checkouts" element={<Checkouts baseUrl={baseUrl} />} />
            <Route path="/users" element={<UsersComponent baseUrl={`${baseUrl}/users`} />} />
            <Route path="/newcheckout" element={<NewCheckout baseUrl={baseUrl} />} />
            <Route path="/history" element={<History baseUrl={baseUrl} />} />
          </>
        )}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
