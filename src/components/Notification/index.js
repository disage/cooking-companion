import React, { forwardRef, useImperativeHandle, useState } from 'react'
import './index.css'

const Notification = forwardRef((props, ref) => {
  const [showNotification, setShowNotification] = useState(false)
  const [message, setMessage] = useState('')

  const handlerShowNotification = (message) => {
    setMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  useImperativeHandle(ref, () => ({
    handlerShowNotification
  }))

  return (
    <>
      {showNotification && (
        <div className={`notification ${showNotification && 'active'}`}>
          <p>{message}</p>
        </div>
      )}
    </>
  )
})

export default Notification
