import React, { forwardRef, useImperativeHandle, useState} from 'react';
import './index.css'

const Notification = forwardRef((props, ref) => {
  const [showNotification, setShowNotification] = useState(false);

  const handlerShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useImperativeHandle(ref, () => ({
    handlerShowNotification
  }));

  return (
    <>
      {showNotification && (
        <div className={`notification ${showNotification && 'active'}`}>
          <p>{props.message}</p>
        </div>
      )}
    </>
  );
});

export default Notification;
