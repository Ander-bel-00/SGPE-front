import React, { useEffect } from 'react';
import './css/PopupMessage.css';

const PopupMessage = ({ message, onClose }) => {
  // Use useEffect to automatically close the message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    // Clean up the timer if the component unmounts before 1 seconds
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="popup-message">
      <div className="message-content">
        <p>{message}</p>
        {/* Remove the button for closing manually */}
      </div>
    </div>
  );
};

export default PopupMessage;
