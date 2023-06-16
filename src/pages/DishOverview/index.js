import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import './index.css'
import Navbar from '../../components/Navbar'
import Toolbar from '../../components/Toolbar'

const DishOverview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const formatedInstructuins = location.state?.generatedDish?.instructions?.split('\n')

  useEffect(() => {
    if (!location.state?.generatedDish) navigate('/home')
  }, [location.state?.generatedDish, navigate])

  return (
    <div className="dishOverview page">
      <Navbar />
      <Toolbar options={['time', 'type', 'share']} />
      {location.state?.generatedDish && (
        <div className="dishDescription">
          <h3>{location.state?.generatedDish?.name}</h3>
          <b>Ingredients:</b>
          <p className="suggesedDishDescription">{location.state?.generatedDish?.ingredients}</p>
          <b>Instrusctions:</b>
          {formatedInstructuins &&
            formatedInstructuins.map((step, index) => (
              <p key={index} className="suggesedDishDescription">
                {step}
              </p>
            ))}
        </div>
      )}
    </div>
  )
}
export default DishOverview
