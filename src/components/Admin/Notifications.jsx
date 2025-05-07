import React, { useState } from 'react';
import './Notifications.css';
import { FaBell, FaTrash, FaCheckCircle } from 'react-icons/fa';

const initialNotifications = [
  { id: 1, text: 'New user registered', time: '2 min ago', read: false },
  { id: 2, text: 'Order #1234 completed', time: '10 min ago', read: false },
  { id: 3, text: 'Server backup successful', time: '1 hr ago', read: true },
  { id: 4, text: 'New product added', time: '2 hrs ago', read: false },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications((notifs) =>
      notifs.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((notifs) => notifs.filter((n) => n.id !== id));
  };

  return (
    <div className="notifications-admin-page">
      <div className="notifications-header-row">
        <div className="notifications-title"><FaBell /> Notifications</div>
      </div>
      <div className="notifications-list-wrapper">
        {notifications.length === 0 ? (
          <div className="no-notifications">No notifications.</div>
        ) : (
          <ul className="notifications-list">
            {notifications.map((notif) => (
              <li key={notif.id} className={notif.read ? 'read' : ''}>
                <span className="notif-text">{notif.text}</span>
                <span className="notif-time">{notif.time}</span>
                <div className="notif-actions">
                  {!notif.read && (
                    <button className="mark-read-btn" title="Mark as read" onClick={() => markAsRead(notif.id)}>
                      <FaCheckCircle />
                    </button>
                  )}
                  <button className="delete-btn" title="Delete" onClick={() => deleteNotification(notif.id)}>
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications; 