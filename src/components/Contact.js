
import { Link } from "react-router-dom";
import "./Styles.css"; 

function About() {
    return (
        <div className="container">
            <div className="links">
            <h1>This is the about page</h1>
                <Link to="/">Click to view our Home page</Link>
                <Link to="/about">Click to view our about page</Link>
            </div>
        </div>
    )
}

export default About