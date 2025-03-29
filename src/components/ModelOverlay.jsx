import React from 'react';
import "../styles/App.scss";

const Modal = ({ isOpen, onClose, title, message, primaryAction, secondaryAction }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
    <div className="modal">
      {/* Close button pinned to the top-right corner */}
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
  
      <div className="modal-header">
        <h2>{title}</h2>
      </div>
  
      <div className="modal-body">
        {typeof message === 'string' ? (
          <p>{message}</p> // If `message` is a string, render it as a paragraph
        ) : (
          // Render the `message` if it's a JSX element (like the welcome message)
          <div className="welcome-message">
            <p>For the best experience, we'll switch to fullscreen mode.</p>
            <div>
              <p>Tips for success:</p>
              <ul>
                <li>Find a quiet environment</li>
                <li>Close distracting applications</li>
                <li>Make sure you have enough time</li>
              </ul>
            </div>
          </div>
        )}
      </div>
  
      <div className="modal-footer">
        {primaryAction && (
          <button className="modal-primary-button" onClick={primaryAction.onClick}>
            {primaryAction.icon && primaryAction.icon} {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button className="modal-secondary-button" onClick={secondaryAction.onClick}>
            {secondaryAction.icon && secondaryAction.icon} {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  </div>  
  );  
};

export default Modal;