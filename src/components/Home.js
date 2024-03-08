import React from 'react';

const Home = ({ profile, login, logOut }) => {
  const handleLogin = () => {
    if (login) {
      login(); 
    }
  };

  const handleLogOut = () => {
    if (logOut) {
      logOut(); 
    }
  };

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      {!profile && <button onClick={handleLogin}>Log In</button>}
      {profile && (
        <div>
          <p>You are logged in as {profile.name}</p>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      )}
    </div>
  );

};

export default Home;
