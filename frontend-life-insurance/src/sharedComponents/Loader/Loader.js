import React from 'react'
import './loader.css'

export const Loader = () => {
  return (
    <div className="loader-container bg-gray-100">
        <div className="bouncing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    </div>
  )
}
