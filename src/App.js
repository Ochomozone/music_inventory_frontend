import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
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
  // const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Function to handle user login
  const handleLogin = () => {
    login();
  };

  // Function to handle user logout
  const handleLogout = () => {
    googleLogout();
    setProfile(null);
    navigate('/');
    sessionStorage.removeItem('profile');
  };

  // Effect to fetch user profile data on login
  useEffect(() => {
    const storedProfile = sessionStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Google login hook
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // setUser(codeResponse);
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
          sessionStorage.setItem('profile', JSON.stringify(res.data));
          navigate('/instruments');
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div>
      <NavigationBar baseUrl={baseUrl} profile={profile} logOut={handleLogout} />
      <Routes>
        <Route path="/" element={<Home profile={profile} login={handleLogin} logout={handleLogout}/>} />
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
