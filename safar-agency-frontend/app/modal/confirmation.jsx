// ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this car?</p>
          <div className="flex justify-end space-x-2">
            <button 
              className="bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700" 
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmationModal;
