import React from 'react';

const Home = ({ profile, login }) => {
  const handleLogin = () => {
    if (login) {
      login(); // Call the login function passed as a prop
    }
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      {!profile && <button onClick={handleLogin}>Log In</button>}
    </div>
  );
};

export default Home;
