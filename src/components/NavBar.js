
import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav
      className={`navbar ${isMobile ? "mobile" : ""}`}>
        <ul style={{ flexDirection: isMobile ? "column" : "row", display: isMobile ? "none" : "flex" }}>
          <li>
            <NavLink to="/instruments" className="navbar-link">Instruments</NavLink> 
          </li>
          <li>
            <NavLink to="/checkouts" className="navbar-link">Checkouts</NavLink>
          </li>
          <li>
            <NavLink to="/users" className="navbar-link">Users</NavLink>
          </li>
          <li>
            <NavLink to="/newcheckout" className="navbar-link">Checkout Instrument</NavLink>
          </li>
        </ul>
    </nav>
  );
};

export default Navbar;
       
  

// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { IoClose, IoMenu } from "react-icons/io5";
// import "./NavBar.css";

// const NavigationBar = () => {
//   const [showMenu, setShowMenu] = useState(false);

//  const toggleMenu = () => {
//    setShowMenu(!showMenu);
//  };

//   const closeMenuOnMobile = () => {
//     if (window.innerWidth <= 1150) {
//       setShowMenu(false);
//     }
//   };
//  return (
//    <header className="header">
//      <nav className="nav container">
     
//        <NavLink to="/" className="nav__logo">
//          Navigation Bar
//        </NavLink>

//        <div
//          className={"nav__menu"}
//          id="nav-menu"
//        >
//          <ul className="nav__list">
//            <li className="nav__item">
//            <NavLink to="/instruments" className="nav-link">Instruments</NavLink> 
//            </li>
//            <li className="nav__item">
//            <NavLink to="/checkouts" className="nav-link">Checkouts</NavLink>
//            </li>
//            <li className="nav__item">
//            <NavLink to="/users" className="nav-link">Users</NavLink>
//            </li>
//            <li className="nav__item">
//            <NavLink to="/newcheckout" className="nav-link">Checkout Instrument</NavLink>
//            </li>
           
//          </ul>
//          <div className="nav__close" id="nav-close">
//            <IoClose />
//          </div>
//        </div>

//        <div className="nav__toggle" id="nav-toggle">
//          <IoMenu />
//        </div>
//      </nav>
//    </header>
//  );
// };

// export default NavigationBar;
