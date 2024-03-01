import React from 'react';
import { Link } from "react-router-dom";

function About() {
    return (
        <div className="container">
        <div className="links">
        <h1>This is the Contact page</h1>
            <Link to="/">Click to view our Home page</Link>
            <Link to="/contact">Click to view our About page</Link>
        </div>
    </div>
    )
}

export default About