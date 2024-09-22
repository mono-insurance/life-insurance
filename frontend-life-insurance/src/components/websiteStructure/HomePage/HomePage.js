import React, { useEffect, useState } from 'react';
import photo4 from '../../../assets/images/photo4.jpg';
import photo5 from '../../../assets/images/photo5.jpg';
import photo6 from '../../../assets/images/photo6.jpeg';
import photo7 from '../../../assets/images/photo7.jpeg';
import './homePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [photo4, photo5, photo6, photo7];
    const [animateText, setAnimateText] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
      setAnimateText(true);
  }, []);

    return (
      <div className='gap-4'>
      <div className="flex overflow-hidden" style={{ height: '500px' }}>
      {/* Left Side: Title and Slogan */}
      <div className={`flex flex-col justify-center w-1/2 p-10 transition-transform duration-700 ${animateText ? 'translate-x-0' : '-translate-x-20 opacity-0'} hover:pendulum`}>
          <h1 className="flex text-8xl font-bold text-gray-600 custom-shadow">Sura<p className='text-indigo-400'>ksha</p></h1>
          <p className="mt-4 text-3xl text-gray-700">Your Safety, Our Priority</p>
      </div>

      {/* Right Side: Image Carousel */}
      <div className="relative w-1/2 overflow-hidden">
          <div className="absolute inset-0">
              <div
                  className="flex transition-transform duration-700 py-10"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                  {images.map((image, index) => (
                      <img
                          key={index}
                          src={image}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-cover" // Fill the height of the screen
                      />
                  ))}
              </div>
          </div>
      </div>
      
  </div>
  <div className="flex">
  {/* Benefits Cards */}
  <div className='pr-20 mt-20'>
    <div className="w-full grid grid-cols-2 grid-rows-3 gap-0">
      <div className="bg-stone-100 p-6 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out transform hover:shadow-2xl hover:scale-105 col-start-1 row-start-1">
          <h3 className="text-2xl font-semibold">Financial Security</h3>
          <p className="mt-2 text-gray-600">Protect your family’s future with guaranteed payouts.</p>
      </div>
      
      <div className="bg-stone-100 p-6 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out transform hover:shadow-2xl hover:scale-105 col-start-2 row-start-2">
          <h3 className="text-2xl font-semibold">Flexible Premiums</h3>
          <p className="mt-2 text-gray-600">Choose a premium plan that fits your budget and needs.</p>
      </div>
      
      <div className="bg-stone-100 p-6 rounded-lg shadow-lg transition-shadow duration-300 ease-in-out transform hover:shadow-2xl hover:scale-105 col-start-1 row-start-3">
          <h3 className="text-2xl font-semibold">Comprehensive Coverage</h3>
          <p className="mt-2 text-gray-600">Enjoy peace of mind with coverage for various risks.</p>
      </div>
    </div>
  </div>

  {/* About Us Section */}
    <div className="w-1/2 p-10 mt-20">
        <h2 className="text-4xl font-bold text-gray-800">About Us</h2>
        <p className="mt-4 text-lg text-gray-600">We are dedicated to providing the best services for your safety. Our commitment to excellence ensures that you receive the highest quality support and care.</p>
        <p className="mt-2 text-lg text-gray-600">Choose us for our experience, reliability, and a customer-centric approach that prioritizes your needs and well-being.</p>
    </div>
</div>
<div className="flex justify-between mt-20">
    <div className='w-full p-10 rounded-lg'>
        <h2 className="text-4xl font-bold text-gray-800">Why Choose Us?</h2>
        <ul className="mt-4 list-disc list-inside text-lg text-gray-600">
            <li>Expert Advisors Available 24/7</li>
            <li>Tailored Insurance Plans to Fit Your Needs</li>
            <li>Quick and Hassle-Free Claims Process</li>
            <li>Strong Financial Stability and Trust</li>
        </ul>
    </div>
    <div className="flex items-center mr-24">
    <button onClick={() => navigate('/suraksha/insurances')} className="flex-row px-6 py-3 text-white text-xl bg-indigo-500 rounded-full hover:bg-indigo-700 transition duration-300 whitespace-nowrap">
        Explore Our Products<span className="ml-2 text-3xl align-middle">&#8594;</span>
    </button>
        
    </div>
</div>

</div>
    );
};

export default HomePage;
