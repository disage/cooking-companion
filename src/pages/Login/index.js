import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import './index.css';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import { auth, signInWithEmail } from "../../firebase";

const Login = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const notificationRef = useRef(null);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        isLoggedIn && navigate('/home')
    }, [navigate, isLoggedIn]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const user = await signInWithEmail(email, password);
            localStorage.setItem('uid', user.uid);
        } catch (error) {
            console.log(error);
            if (error.message === 'Firebase: Error (auth/user-not-found).' && notificationRef.current) {
                notificationRef.current.handlerShowNotification('Account not found !');
            }
        }
    };

    const signInWithGoogle = async (e) => {
        e.preventDefault();
        await signOut(auth);
        localStorage.removeItem('username');
        localStorage.removeItem('uid')
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (res) => {
                localStorage.setItem('username', res.user.displayName);
                localStorage.setItem('uid', res.user.uid);
                navigate('/home');
            })
            .catch((error) => {
                console.log("signInWithGoogle", error);
            });
    };

    return (
        <div className='loginPage'>
            <Notification ref={notificationRef} />
            <div className='loginTitle'>
                <h2>Login</h2>
                <p>Get cooking and enjoy the flavors!</p>
            </div>
            <div className='loginFormWrapper'>
                <form className='loginForm' onSubmit={handleSignIn}>
                    <label className='loginFormField'>
                        Email:
                        <input type="email" value={email} onChange={handleEmailChange} />
                    </label>
                    <label className='loginFormField'>
                        Password:
                        <input type="password" value={password} onChange={handlePasswordChange} />
                    </label>
                    <div className='loginActions'>
                        <svg className="googleIcon" onClick={signInWithGoogle} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.7969 38.4C10.65 38.4 2.39374 30.1469 2.39374 20C2.39374 9.8531 10.65 1.59998 20.7969 1.59998C25.3937 1.59998 29.7937 3.3031 33.1906 6.39685L33.8094 6.96248L27.7406 13.0312L27.1781 12.55C25.3969 11.025 23.1312 10.1844 20.7969 10.1844C15.3844 10.1844 10.9781 14.5875 10.9781 20C10.9781 25.4125 15.3844 29.8156 20.7969 29.8156C24.7 29.8156 27.7844 27.8219 29.2375 24.425H19.9969V16.1406L38.0375 16.1656L38.1719 16.8C39.1125 21.2656 38.3594 27.8344 34.5469 32.5344C31.3906 36.425 26.7656 38.4 20.7969 38.4Z" fill="#E68966" />
                        </svg>
                        <Button type="submit" text="Login" />
                    </div>
                    <Link to="/registration">New User ? Sign Up now !</Link>
                </form>
            </div>
        </div>
    );
};
export default Login;