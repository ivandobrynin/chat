import React from 'react';
import { Link }from 'react-router-dom';

export const Profile = () => {
  return (
    <div className="container">
      <h1>Profile page</h1>
      <h3>Coomming soon...</h3>
      <div className="profile__links">
        <Link to="/">Go to Feed</Link>
        <Link to="/chat">Go to Chat</Link>
      </div>
    </div>
  )
}