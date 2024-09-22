import React, { useEffect, useState } from 'react';
import LogoBlue from '../../assets/images/logo_blue.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdOutlinePersonOutline, MdOutlineArrowDropDown } from 'react-icons/md';

export const Navbar = ({ navLinks=[], dropdownItems=[] }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('auth'));
    

    useEffect(() => {
        const storedToken = localStorage.getItem('auth');
        setToken(storedToken);
    }, []);

    return (
        <div className='flex items-center justify-between text-sm py-4 pb-2 mb-5 border-b border-b-gray-400'>
            <div className='flex gap-1'>
                <img className='w-20 cursor-pointer' src={LogoBlue} alt="" />
                <p className='text-indigo-500 py-3 text-3xl font-bold text-center bg-white'>
                    Suraksha - E Insurance
                </p>
            </div>
            
            <div className='flex gap-2'>
                <ul className='hidden md:flex items-start gap-5 font-medium'>
                    {/* If not logged in, show PRODUCTS and HOME links */}
                    {token && navLinks.length > 0? (
                        <>
                         {navLinks.map((link, index) => (
                            <NavLink key={index} to={link.path} className='activeness'>
                                <li className='py-1'>{link.label}</li>
                                <hr className='border-none outline-none h-0.5 bg-indigo-900 w-3/5 m-auto hidden' />
                            </NavLink>
                        ))}
                            
                        </>
                    ) : (
                        // If logged in, render provided navLinks
                        <>
                        <NavLink to='/suraksha/home' className='activeness'>
                            <li className='py-1'>HOME</li>
                            <hr className='border-none outline-none h-0.5 bg-indigo-900 w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink to='/suraksha/insurances' className='activeness'>
                            <li className='py-1'>PRODUCTS</li>
                            <hr className='border-none outline-none h-0.5 bg-indigo-900 w-3/5 m-auto hidden' />
                        </NavLink>
                        </>
                    )}
                </ul>
            </div>
            <div className='flex gap-4 items-center'>
                {token && dropdownItems.length>0? (
                    <div className='flex items-center cursor-pointer group relative'>
                        <MdOutlinePersonOutline size={30} />
                        <MdOutlineArrowDropDown size={30} />
                        <div className='absolute top-0 right-0 pt-11 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                {dropdownItems.map((item, index) => (
                                    <p key={index} onClick={item.onClick} className='hover:text-black cursor-pointer'>
                                        {item.label}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/suraksha/login')} className='bg-indigo-500 text-lg text-white px-8 py-1 rounded-full font-light hidden md:block'>
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};