import React from 'react';

interface A11yAnnouncerProps {
  message: string;
}

export const A11yAnnouncer: React.FC<A11yAnnouncerProps> = ({ message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};
