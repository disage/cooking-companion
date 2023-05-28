import React from "react";

import "./index.css"

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="userProfile">
                <svg className="profileIcon" width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="29" cy="29" r="29" fill="#F8F4ED" />
                    <circle cx="28.96" cy="20.9242" r="6.9242" fill="#332D46" />
                    <path d="M40.92 40.4379C40.92 44.262 35.5653 42.9558 28.96 42.9558C22.3547 42.9558 17 44.262 17 40.4379C17 36.6137 22.3547 27.8484 28.96 27.8484C35.5653 27.8484 40.92 36.6137 40.92 40.4379Z" fill="#332D46" />
                </svg>

                <div className="profileText">
                    Hey, Ivan
                    <b>Ready to eat ?</b>
                </div>
            </div>
            <svg className="menuIcon" width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="2" rx="1" fill="#332D46" />
                <rect x="10" y="8" width="16" height="2" rx="1" fill="#332D46" />
                <rect y="16" width="26" height="2" rx="1" fill="#332D46" />
            </svg>
        </div>
    );
}

export default Navbar;