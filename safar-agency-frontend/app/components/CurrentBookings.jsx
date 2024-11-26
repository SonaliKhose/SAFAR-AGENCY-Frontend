import React, { useEffect, useState } from 'react';
import BookingTable from './BookingTable';

// Function to get token from session storage
const getAuthToken = () => {
  return sessionStorage.getItem('authToken'); // Assuming the token is stored in session storage
};

const CurrentBookings = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch('http://localhost:5000/travelbookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send token in the Authorization header
          },
        });
        const data = await response.json();

        const filteredBookings = data.filter((booking) => {
          const status = booking.bookingStatus.trim().toLowerCase();
          return status === 'pending' || status === 'confirmed';
        });

        setCurrentBookings(filteredBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (index, newStatus) => {
    const updatedBookings = [...currentBookings];
    const booking = updatedBookings[index];
    booking.bookingStatus = newStatus;

    // Update status in the backend via PUT request
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/travelbookings/${booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token in the Authorization header
        },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });

      if (response.ok) {
        console.log('Status updated successfully');
        // Filter bookings to ensure only 'Pending' or 'Confirmed' remain
        const filteredBookings = updatedBookings.filter(b => b.bookingStatus === 'Pending' || b.bookingStatus === 'Confirmed');
        setCurrentBookings(filteredBookings);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(currentBookings.length / itemsPerPage); // Calculate total pages
  const startIndex = (currentPage - 1) * itemsPerPage; // Start index for slicing
  const currentItems = currentBookings.slice(startIndex, startIndex + itemsPerPage); // Current page items

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Current Bookings</h2>
      {/* Dropdown always enabled for current bookings */}
      <BookingTable
        bookings={currentItems} // Pass the paginated bookings
        onStatusChange={handleStatusChange}
        showDropdown={true}
      />

      {/* Render pagination controls only if there are pages */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center my-4 space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>

          {/* Page number buttons */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentBookings;
