import React from 'react';
import { NavLink } from 'react-router-dom';
const NavigationBar = () => {
    return (
      <nav>
        <ul>
          <li>
            <NavLink to="/instruments">Instruments</NavLink>
          </li>
          <li>
            <NavLink to="/checkouts" >Checkouts</NavLink>
          </li>
          <li>
            <NavLink to="/users" >Users</NavLink>
          </li>
        </ul>
      </nav>
    );
  };
  

export default NavigationBar;
