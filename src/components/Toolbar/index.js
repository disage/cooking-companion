import React, { useState } from 'react'

import './index.css'
import useTime from '../../helpers/timeUtils'
import personIcon from '../../icons/person-icon.svg'

const Toolbar = ({ options, onAdd, onClear, getPersonsAmount }) => {
  const { currentTime, mealTime } = useTime()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [personsAmount, setPersonsAmount] = useState(1)

  const personsAmountValues = [
    { id: 1, amount: 1 },
    { id: 2, amount: 2 },
    { id: 3, amount: 3 },
    { id: 4, amount: 4 }
  ]

  const handlePersonsAmount = (value) => {
    setPersonsAmount(value)
    getPersonsAmount(value)
  }

  return (
    <div className={`toolbar ${options.length === 2 ? 'flexStart' : 'flexSpaceBetween'}`}>
      {options.includes('time') && <b className="toolbarItem">{currentTime}</b>}
      {options.includes('type') && <div className="toolbarItem">{mealTime}</div>}
      {options.includes('persons') && (
        <div className="toolbarDropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="toolbarItem toolbarAction">
            {personsAmount}
            <img className="personIcon" src={personIcon} alt="Person Icon" />
            <svg
              className="arrowBottomIcon"
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1L7.5 9L14 1" stroke="#332D46" strokeWidth="2" />
            </svg>
          </div>
          {isDropdownOpen && (
            <ul>
              {personsAmountValues.map((value) => (
                <li
                  key={value.amount}
                  className="toolbarItem toolbarAction"
                  onClick={() => handlePersonsAmount(value.amount)}
                >
                  {value.amount}
                  <img className="personIcon" src={personIcon} alt="Person Icon" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {options.includes('add') && (
        <div className="toolbarItem toolbarAction" onClick={onAdd}>
          Add
        </div>
      )}
      {options.includes('clear') && (
        <div className="toolbarItem toolbarAction" onClick={onClear}>
          Clear All
        </div>
      )}
      {options.includes('share') && <div className="toolbarItem toolbarAction shareAction">Share</div>}
    </div>
  )
}

export default Toolbar
