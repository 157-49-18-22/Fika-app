import React from 'react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <div className="settings-section">
        <h3>Profile</h3>
        <div className="settings-row">
          <span>Name:</span>
          <span>Testr111</span>
        </div>
        <div className="settings-row">
          <span>Email:</span>
          <span>testr111@gmail.com</span>
        </div>
      </div>
      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="settings-row">
          <span>Newsletter:</span>
          <span>Subscribed</span>
        </div>
        <div className="settings-row">
          <span>Language:</span>
          <span>English</span>
        </div>
      </div>
      <div className="settings-section">
        <h3>Security</h3>
        <div className="settings-row">
          <span>Password:</span>
          <span>******** <button className="settings-btn">Change</button></span>
        </div>
      </div>
    </div>
  );
};

export default Settings; 