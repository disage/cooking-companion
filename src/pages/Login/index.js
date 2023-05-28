import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index.css';
import Button from '../../components/Button';
import { auth } from "../../firebase";

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const signInWithGoogle = async (e) => {
        e.preventDefault();
        await signOut(auth);
        localStorage.removeItem('idToken');
        localStorage.removeItem('uid')
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (res) => {
                const idToken = await res.user.getIdToken();
                localStorage.setItem('idToken', idToken);
                localStorage.setItem('uid', res.user.uid);
                console.log(localStorage)
                navigate('/home');
            })
            .catch((err) => {
                console.log("signInWithGoogle", err);
            });
    };

    return (
        <div className='loginPage'>
            <div className='loginTitle'>
                <h2>Login</h2>
                <p>Get cooking and enjoy the flavors!</p>
            </div>
            <div className='loginFormWrapper'>
                <form className='loginForm' onSubmit={signInWithGoogle}>
                    <label className='loginFormField'>
                        Name:
                        <input type="text" value={name} onChange={handleNameChange} />
                    </label>
                    <label className='loginFormField'>
                        Email:
                        <input type="email" value={email} onChange={handleEmailChange} />
                    </label>
                    <div className='loginActions'>
                        <svg onClick={signInWithGoogle} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.7969 38.4C10.65 38.4 2.39374 30.1469 2.39374 20C2.39374 9.8531 10.65 1.59998 20.7969 1.59998C25.3937 1.59998 29.7937 3.3031 33.1906 6.39685L33.8094 6.96248L27.7406 13.0312L27.1781 12.55C25.3969 11.025 23.1312 10.1844 20.7969 10.1844C15.3844 10.1844 10.9781 14.5875 10.9781 20C10.9781 25.4125 15.3844 29.8156 20.7969 29.8156C24.7 29.8156 27.7844 27.8219 29.2375 24.425H19.9969V16.1406L38.0375 16.1656L38.1719 16.8C39.1125 21.2656 38.3594 27.8344 34.5469 32.5344C31.3906 36.425 26.7656 38.4 20.7969 38.4Z" fill="#E68966" />
                        </svg>
                        <Button type="submit" text="Login" />
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;