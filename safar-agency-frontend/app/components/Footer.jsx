import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-700 to-blue-500 text-white py-12  mt-6 w-[calc(100%-16rem)] ml-64 shadow-lg"> {/* Increased vertical padding to py-12 */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">SAFAR </h2>
          <p className="text-sm">Your travel partner for unforgettable journeys.</p>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-8 mb-4 md:mb-0 text-center md:text-left"> {/* Center text for mobile, left align for desktop */}
          <a href="/about" className="hover:underline hover:text-gray-200">About Us</a>
          <a href="/services" className="hover:underline hover:text-gray-200">Services</a>
          <a href="/contact" className="hover:underline hover:text-gray-200">Contact</a>
          <a href="/privacy" className="hover:underline hover:text-gray-200">Privacy Policy</a>
        </div>
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-3xl hover:text-blue-400 transition-colors duration-200" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-3xl hover:text-blue-400 transition-colors duration-200" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-3xl hover:text-pink-400 transition-colors duration-200" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-3xl hover:text-blue-600 transition-colors duration-200" />
          </a>
        </div>
      </div>
      <div className="text-center text-sm mt-4">
        <span>© 2024 SAFAR . All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
