import React from 'react'
import LogoBlue from '../../assets/images/logo_blue.svg';
import {
    MdOutlineFacebook,
    MdOutlineWhatsapp,
} from 'react-icons/md';

export const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <div className='flex gap-1  w-80'>
                    <img className='w-20 cursor-pointer' src={LogoBlue} alt="" />
                    <p className='text-indigo-500 py-3 text-lg font-bold text-center bg-white'>
                        Suraksha - E Insurance
                    </p>
                </div>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'> <strong>Suraksha</strong> a seamless digital platform designed to offer you comprehensive insurance solutions at your fingertips. With a user-friendly interface and a wide range of customizable policies, we ensure your peace of mind with the best coverage options available. At Suraksha, we believe in safeguarding your future because "Your Safety, Our Priority!". Explore our latest offerings and secure your life, health, and assets today with just a few clicks!</p>

            </div>
            <div>
                <p className='text-xl font-medium mb-5 mt-3'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>About Us</li>
                    <li>Home</li>
                    <li>FAQs</li>
                </ul>

            </div>
            <div>

                <p className='text-xl font-medium mb-5 mt-3'>GET IN TOUCH</p>
                <div className='flex flex-col gap-2 text-gray-600'>
                    <MdOutlineFacebook size={30} />
                    <MdOutlineWhatsapp size={30} />
                </div>

            </div>
        </div>
        <div>
            <hr />
            <p className='text-center text-sm py-5'>Copyright© 2024 Suraksha. All Rights Reserved.</p>

        </div>
    </div>
  )
}
