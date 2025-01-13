import React, { useEffect, useState } from 'react';
import './styles.css';

export interface ToastMessage {
  severity: 'success' | 'error' | 'info' | 'warn';
  summary: string;
  detail?: string;
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
  life?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, life = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, life);

      return () => clearTimeout(timer);
    }
  }, [message, life, onClose]);

  if (!message || !visible) {
    return null;
  }

  const getIcon = () => {
    switch (message.severity) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      case 'warn':
        return '⚠';
      default:
        return '';
    }
  };

  return (
    <div className={`toast-container ${visible ? 'visible' : ''}`}>
      <div className={`toast-message ${message.severity}`}>
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-content">
          <div className="toast-summary">{message.summary}</div>
          {message.detail && <div className="toast-detail">{message.detail}</div>}
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}; 