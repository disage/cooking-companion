import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './index.css';
import Button from '../../components/Button';
import Notification from "../../components/Notification";
import { createUserWithEmail } from "../../firebase";

const Registration = ({ isLoggedIn }) => {
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        isLoggedIn && navigate('/home');
    }, [navigate, isLoggedIn]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const user = await createUserWithEmail(email, password);
            localStorage.setItem('uid', user.uid);
        } catch (error) {
            console.error(error);
            if (error.message === 'Firebase: Error (auth/email-already-in-use).' && notificationRef.current) {
                notificationRef.current.handlerShowNotification('You already have an account !');
            }
            if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).' && notificationRef.current) {
                notificationRef.current.handlerShowNotification('Password should be at least 6 characters !');
            }
        }
    };

    return (
        <div className='loginPage'>
            <Notification ref={notificationRef} />
            <div className='loginTitle'>
                <h2>Sign Up</h2>
                <p>Get cooking and enjoy the flavors!</p>
            </div>
            <div className='loginFormWrapper'>
                <form className='loginForm' onSubmit={handleSignUp}>
                    <label className='loginFormField'>
                        Email:
                        <input type="email" value={email} onChange={handleEmailChange} />
                    </label>
                    <label className='loginFormField'>
                        Password:
                        <input type="password" value={password} onChange={handlePasswordChange} />
                    </label>
                    <Button type="submit" text="Sign Up" />
                    <Link to="/login">Have an account ? Sign In now !</Link>
                </form>
            </div>
        </div>
    );
};
export default Registration;