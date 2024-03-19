import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {ShowCheckoutsLink, ShowLogsLink, ShowUsersLink, ShowInstrumentsLink,ShowNewCheckoutLink} from '../util/Permissions';
import './Navbar.css';

const Navbar = ({ profile, logOut }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showLogsLink = ShowLogsLink(profile);
  const showNewCheckoutLink = ShowNewCheckoutLink(profile);
  const showUsersLink = ShowUsersLink(profile);
  const showInstrumentsLink = ShowInstrumentsLink(profile);
  const showCheckoutsLink = ShowCheckoutsLink(profile);

  return (
    <nav className={`navbar ${isMobile ? 'mobile' : ''}`}>
      <div className="navbar-left">
        {profile && (
          <div className="navbar-profile">
            <img src={profile.picture} alt="Profile" style={{ width: '40px', borderRadius: '50%' }} />
          </div>
        )}
        {profile && (
          <div className="navbar-profile">
            <p style={{ margin: '0 1rem' }}>{profile.name}</p>
          </div>
        )}
        {profile && (
          <div className="navbar-profile">
            <button onClick={logOut}>Log out</button>
          </div>
        )}
      </div>
      <div className="navbar-right">
        <ul>
        <li>
            <NavLink to="/" className="navbar-link">
              Home
            </NavLink>
          </li>
          {showInstrumentsLink && (
          <li>
            <NavLink to="/instruments" className="navbar-link">
              Instruments
            </NavLink>
          </li>
          )}
          {showCheckoutsLink && (
          <li>
            <NavLink to="/checkouts" className="navbar-link">
              Checkouts
            </NavLink>
          </li>
           )}
          {showUsersLink && (
          <li>
            <NavLink to="/users" className="navbar-link">
              Users
            </NavLink>
          </li>
            )}
          {showNewCheckoutLink && (
          <li>
            <NavLink to="/newcheckout" className="navbar-link">
              Checkout Instrument
            </NavLink>
          </li>
           )}
          {showLogsLink && (
            <li>
              <NavLink to="/history" className="navbar-link">
                Logs
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
