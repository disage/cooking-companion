import React, { useState, useEffect } from 'react'

import './index.css'
import Menu from '../Menu'
import { auth } from '../../firebase'

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
                {
                    avatarUrl
                      ? <img className="profileAvatar" src={avatarUrl} alt="User Avatar" />
                      : <svg className="profileIcon" width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="29" cy="29" r="29" fill="#F8F4ED" />
                            <circle cx="28.96" cy="20.9242" r="6.9242" fill="#332D46" />
                            <path d="M40.92 40.4379C40.92 44.262 35.5653 42.9558 28.96 42.9558C22.3547 42.9558 17 44.262 17 40.4379C17 36.6137 22.3547 27.8484 28.96 27.8484C35.5653 27.8484 40.92 36.6137 40.92 40.4379Z" fill="#332D46" />
                        </svg>
                }
                <div className="profileText">
                    Hey, {username || 'Chef'}
                    <b>Ready to eat ?</b>
                </div>
            </div>
            <svg className="menuIcon" onClick={openModal} width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="2" rx="1" fill="#332D46" />
                <rect x="10" y="8" width="16" height="2" rx="1" fill="#332D46" />
                <rect y="16" width="26" height="2" rx="1" fill="#332D46" />
            </svg>
        </div>
  )
}

export default Navbar
