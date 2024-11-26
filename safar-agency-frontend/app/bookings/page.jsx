//Main page
"use client"

import React, { useState } from 'react';
import CurrentBookings from '../components/CurrentBookings';
import CompletedBookings from '../components/CompletedBookings';
import CanceledBookings from '../components/CanceledBookings';
import DownloadReport from '../components/DownloadReport';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const Bookings = () => {
  const [activeTab, setActiveTab] = useState('current');
  const router = useRouter();
  // useEffect(() => {
  //   const loginToken = sessionStorage.getItem("authToken");
  //   if (!loginToken) {
  //     router.push("/login"); // Redirect to login page if token is missing
  //   }
  // }, [router]);
  return (
    <div className="container mx-auto p-4">
       <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Booking Details
      </h1>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('current')}
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            activeTab === 'current'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Current Bookings
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            activeTab === 'completed'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Completed Bookings
        </button>
        <button
          onClick={() => setActiveTab('canceled')}
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            activeTab === 'canceled'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Canceled Bookings
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`py-2 px-4 rounded-lg transition duration-300 ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Download Report
        </button>
      </div>

      {activeTab === 'current' && <CurrentBookings />}
      {activeTab === 'completed' && <CompletedBookings />}
      {activeTab === 'canceled' && <CanceledBookings />}
      {activeTab === 'report' && <DownloadReport />}
    </div>
  );
};

export default Bookings;
