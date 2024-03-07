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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      navigate('/instruments');
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    // Check if profile data is available in sessionStorage
    const storedProfile = sessionStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    // Fetch user profile data if user is authenticated
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
          // Store profile data in sessionStorage
          sessionStorage.setItem('profile', JSON.stringify(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    // Clear profile data from sessionStorage upon logout
    sessionStorage.removeItem('profile');
  };

  return (
    <div>
      <NavigationBar baseUrl={baseUrl} profile={profile} logOut={logOut} />
      <Routes>
        <Route path="/" element={<Home profile={profile} login={login} />} />
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
