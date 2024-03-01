import React from "react";
import { Link } from "react-router-dom";
import "./Styles.css"; 

function Home() {
  return (
    <div className="container">
      <h1>Music Instrument Inventory System</h1>
      <div className="links">
        <Link to="/login">Login In with your google credentials</Link>
        <Link to="/about">Click to view our about page</Link>
        <Link to="/contact">Click to view our contact page</Link>
      </div>
    </div>
  );
}

export default Home;
