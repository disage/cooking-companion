import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

import './index.css'
import { auth, signInWithEmail } from '../../firebase'
import Button from '../../components/Button'
import googleIcon from '../../icons/google-icon.svg'
import Notification from '../../components/Notification'

const Login = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const notificationRef = useRef(null)

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    isLoggedIn && navigate('/home')
  }, [navigate, isLoggedIn])

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }
  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const user = await signInWithEmail(email, password)
      localStorage.setItem('uid', user.uid)
    } catch (error) {
      console.log(error)
      if (error.message === 'Firebase: Error (auth/user-not-found).' && notificationRef.current) {
        notificationRef.current.handlerShowNotification('Account not found !')
      }
    }
  }

  const signInWithGoogle = async (e) => {
    e.preventDefault()
    await signOut(auth)
    localStorage.removeItem('username')
    localStorage.removeItem('uid')
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(async (res) => {
        localStorage.setItem('username', res.user.displayName)
        localStorage.setItem('uid', res.user.uid)
        navigate('/home')
      })
      .catch((error) => {
        console.log(error)
        if (notificationRef.current) {
          notificationRef.current.handlerShowNotification('Google auth failed !')
        }
      })
  }

  return (
    <div className="loginPage">
      <Notification ref={notificationRef} />
      <div className="loginTitle">
        <h2>Login</h2>
        <p>Get cooking and enjoy the flavors!</p>
      </div>
      <div className="loginFormWrapper">
        <form className="loginForm" onSubmit={handleSignIn}>
          <label className="loginFormField">
            Email:
            <input type="email" value={email} onChange={handleEmailChange} />
          </label>
          <label className="loginFormField">
            Password:
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
          <div className="loginActions">
            <img className="googleIcon" src={googleIcon} alt="Google Icon" onClick={signInWithGoogle} />
            <Button type="submit" text="Login" />
          </div>
          <Link to="/registration">New User ? Sign Up now !</Link>
        </form>
      </div>
    </div>
  )
}
export default Login
