//Booking Table
import React from 'react';

const BookingTable = ({ bookings, onStatusChange, showDropdown }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm leading-normal">
            <th className="py-2 px-3 text-left">Sr. No</th>
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">Email</th>
            <th className="py-2 px-3 text-left">Mobile</th>
            <th className="py-2 px-3 text-left">Car Type</th>
            <th className="py-2 px-3 text-left">Car Name</th>
            <th className="py-2 px-3 text-left">From</th>
            <th className="py-2 px-3 text-left">To</th>
            <th className="py-2 px-3 text-left">Date Of Booking</th>
            <th className="py-2 px-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {bookings.map((booking, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gradient-to-r from-blue-50 to-purple-50">
              <td className="py-2 px-3 text-left">{index + 1}</td>
              <td className="py-2 px-3 text-left">{booking.name}</td>
              <td className="py-2 px-3 text-left">{booking.email}</td>
              <td className="py-2 px-3 text-left">{booking.mobileNo}</td>
              <td className="py-2 px-3 text-left">{booking.carType}</td>
              <td className="py-2 px-3 text-left">{booking.carName}</td>
              <td className="py-2 px-3 text-left">{booking.pickupAdd}</td>
              <td className="py-2 px-3 text-left">{booking.dropAdd}</td>
              <td className="py-2 px-3 text-left">{booking.dateOfBooking?.toString().slice(0, 10) || 'N/A'}</td>
              <td className="py-2 px-3 text-left">
  {showDropdown ? (
    <select
      value={booking.bookingStatus}
      onChange={(e) => onStatusChange(index, e.target.value)}
      className="border border-gray-300 rounded p-1"
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirm</option>
      <option value="Completed">Complete</option>
      <option value="Canceled">Cancel</option>
    </select>
  ) : (
    <span>{booking.bookingStatus}</span>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
