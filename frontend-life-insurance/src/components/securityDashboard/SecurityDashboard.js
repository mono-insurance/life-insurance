
import React from 'react';
import { Outlet } from 'react-router-dom';
import photo from '../../assets/images/theme_Photo.jpg';

export const SecurityDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Container */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8 h-full">
        <h1 className="text-3xl md:text-5xl font-bold text-indigo-500 mb-8">
          WELCOME TO SURAKSHA
        </h1>
        {/* Image Container */}
        <div className="relative w-full h-auto overflow-hidden">
          <img
            className="w-full h-[90%] object-cover object-top transform translate-b-[-10%]"
            src={photo}
            alt="Suraksha Welcome"
          />
        </div>
      </div>

      {/* Right Container */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
};
