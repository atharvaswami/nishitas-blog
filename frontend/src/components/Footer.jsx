import React from 'react'
import Nishita from '../images/Nishita.jpg'

const Footer = () => {
  return (
    <footer>
      <div className="about">
        <span>
          Hey there, I'm <b>Nishita Swami</b>, a second year MBBS student at KEMH & Seth GS Medical College, Mumbai.
        </span>
        <img src={Nishita} alt="Nishita" />
      </div>
      <span className='designer'>Website designed by Atharva Swami.</span>
    </footer>
  )
}

export default Footer