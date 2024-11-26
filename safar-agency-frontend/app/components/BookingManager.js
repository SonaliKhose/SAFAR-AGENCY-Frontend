import React, { useState } from 'react';
import CurrentBookings from './CurrentBookings';
import CompletedBookings from './CompletedBookings';
import CanceledBookings from './CanceledBookings';

const Bookings = () => {
  const [activeComponent, setActiveComponent] = useState('current'); // 'current', 'completed', 'canceled'

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 ${activeComponent === 'current' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveComponent('current')}
        >
          Current Bookings
        </button>
        <button
          className={`px-4 py-2 mx-2 ${activeComponent === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveComponent('completed')}
        >
          Completed Bookings
        </button>
        <button
          className={`px-4 py-2 ${activeComponent === 'canceled' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveComponent('canceled')}
        >
          Canceled Bookings
        </button>
      </div>

      {/* Conditional rendering of the components based on state */}
      <div>
        {activeComponent === 'current' && <CurrentBookings />}
        {activeComponent === 'completed' && <CompletedBookings />}
        {activeComponent === 'canceled' && <CanceledBookings />}
      </div>
    </div>
  );
};

export default Bookings;
