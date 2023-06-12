import React from 'react'

import './index.css'

const Button = ({ btnStyle, onButtonClick, text, type }) => {
  return (
        <button className={btnStyle + 'Btn'} type={type} onClick={onButtonClick}>{text}</button>
  )
}

Button.defaultProps = {
  btnStyle: 'solid'
}

export default Button
