import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import "./Styles.css";

function Login() {
  const { loginAction } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Logging in...");
    setLoading(true);
    try {
      // Trigger the login action
      await loginAction();
    } catch (error) {
      console.error("Login failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Log in with your Google credentials</h1>
      <button onClick={handleLogin} disabled={loading} className="login-button">
        {loading ? "Logging in..." : "Log in with Google"}
      </button>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
