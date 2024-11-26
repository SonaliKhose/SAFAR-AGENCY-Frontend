// app/navbar/page.js
import jwt from "jsonwebtoken";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

import { useAuth } from '../context/userContext'; // Adjust the import path as necessary

const Navbar = () => {
  const { username, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Call the logout function from context
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  const handleProfileClick = () => {
    setIsDropdownOpen(false); // Close dropdown when profile is clicked
  };

  return (
    <div className="sticky top-0 z-50 bg-white px-10 shadow-md">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer">
          <div className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 p-1 rounded-md shadow-lg ml-15">
            <span className="block font-bold text-2xl text-white bg-white bg-opacity-10 px-4 py-1 rounded-md tracking-wider">
              <Link href="/">SAFAR</Link>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {username ? (
            <div className="relative">
              <span 
                className="text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition duration-300 flex items-center"
                onClick={toggleDropdown}
              >
                <FaUserCircle className="mr-2 text-xl" />
                <span className="font-bold">Welcome, {username}!</span>
              </span>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <Link href="/traveldetails">
                    <div 
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-600 hover:text-white cursor-pointer transition duration-300 rounded-md"
                      onClick={handleProfileClick} // Close dropdown when profile is clicked
                    >
                      <FaUserCircle className="mr-2" /> {/* Change icon color on hover */}
                      <span className="flex-1">Profile</span>
                    </div>
                  </Link>
                  <div 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-600 hover:text-white cursor-pointer transition duration-300 rounded-md"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-2" />
                    <span className="flex-1">Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="text-purple-600 border-2 border-purple-600 px-5 py-2 rounded-full font-medium hover:bg-purple-600 hover:text-white transition duration-300">
                <Link href="/login">Login</Link>
              </button>
              <button className="text-blue-600 border-2 border-blue-600 px-5 py-2 rounded-full font-medium hover:bg-blue-600 hover:text-white transition duration-300">
                <Link href="/signup">Sign Up</Link>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
