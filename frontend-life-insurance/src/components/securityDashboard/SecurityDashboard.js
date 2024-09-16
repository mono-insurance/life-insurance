import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom';
// import './securityDashboard.css'

export const SecurityDashboard = () => {
    const [window, setWindow] = useState('login');

    return (
        <>
            <div className='main-container'>
                <div className='container'>
                    <div className='form-toggle'>
                        <NavLink to="/auth/login" className={`menu-link ${window === 'login' ? 'active' : ''}`} onClick={() => setWindow('login')}>
                            <span className="menu-link-text">Login</span>
                        </NavLink>
                        <NavLink to="/auth/register" className={`menu-link ${window === 'register' ? 'active' : ''}`} onClick={() => setWindow('register')}>
                            <span className="menu-link-text">Register</span>
                        </NavLink>
                    </div>
                    <div className='form-container'>
                        <Outlet />
                    </div>
                </div>
            </div>


        </>
    )
}
