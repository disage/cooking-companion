import React, { useState, useEffect } from 'react'

import './index.css'
import Menu from '../Menu'
import { auth } from '../../firebase'
import profileIcon from '../../icons/profile-icon.svg'

const Navbar = () => {
  const username = localStorage.username
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(undefined)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const getUserData = () => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setAvatarUrl(user.providerData[0].photoURL)
        }
      })
      setTimeout(() => {
        unsubscribe()
      }, 1000)
    }
    getUserData()
  }, [])

  return (
    <div className="navbar">
      <Menu isOpen={isModalOpen} onClose={closeModal} />
      <div className="userProfile">
        {avatarUrl ? (
          <img className="profileAvatar" src={avatarUrl} alt="User Avatar" />
        ) : (
          <img className="profileIcon" src={profileIcon} alt="Profile Icon" />
        )}
        <div className="profileText">
          Hey, {username || 'Chef'}
          <b>Ready to eat ?</b>
        </div>
      </div>
      <svg
        className="menuIcon"
        onClick={openModal}
        width="26"
        height="18"
        viewBox="0 0 26 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="26" height="2" rx="1" fill="#332D46" />
        <rect x="10" y="8" width="16" height="2" rx="1" fill="#332D46" />
        <rect y="16" width="26" height="2" rx="1" fill="#332D46" />
      </svg>
    </div>
  )
}

export default Navbar
