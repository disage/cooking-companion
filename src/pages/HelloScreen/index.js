import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './index.css'
import dish1Img from '../../icons/dish1.svg'
import dish2Img from '../../icons/dish2.svg'

const HelloScreen = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  useEffect(() => {
    isLoggedIn && navigate('/home')
  }, [navigate, isLoggedIn])

  return (
    <div className="helloScreen">
      <h2 className="welcomeTitle">Welcome to our App !</h2>
      <div>
        <div className="imagesContainer">
          <img src={dish1Img} alt="Dish" />
          <img src={dish2Img} alt="Dish" />
        </div>
        <div className="helloScreenText">
          <p className="description">
            Let's cook a delicious dish using the ingredients you have.We'll help you create a mouthwatering meal with
            the ingredients at your disposal.Let's explore the possibilities and turn your ingredients into a
            masterpiece.
          </p>
          <Link to="/login" className="loginText">
            Login and get cooking and enjoy the flavors!
          </Link>
        </div>
      </div>
    </div>
  )
}
export default HelloScreen
