import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { signOut } from 'firebase/auth'

import './index.css'
import { auth } from '../../firebase'

const Menu = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const navItems = [
    { id: 1, title: 'Home', link: '/home' },
    { id: 2, title: 'My Products', link: '/products' },
    { id: 3, title: 'Cook custom dish', link: '/generateCustomDish' }
  ]

  const logout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem('username')
      localStorage.removeItem('uid')
      navigate('/')
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
        <>
            {isOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <span className="closeMenuIcon" onClick={onClose}>X</span>
                        <h3>Menu</h3>
                        <div className="menu">
                            <ul className="menuList">
                                {navItems.map(item => (
                                    <li key={item.id}>
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="10.3137" y="-0.292893" width="15" height="15" rx="2.5" transform="rotate(45 10.3137 -0.292893)" stroke="#332D46" />
                                        </svg>
                                        <Link to={item.link}>{item.title}</Link>
                                    </li>
                                ))}
                                <li className='logoutBtn' onClick={logout}><svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="10.3137" y="-0.292893" width="15" height="15" rx="2.5" transform="rotate(45 10.3137 -0.292893)" stroke="#332D46" />
                                </svg>
                                    Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
  )
}

export default Menu
