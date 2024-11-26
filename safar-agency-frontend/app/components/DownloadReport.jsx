import React from 'react';

const DownloadReport = () => {
  const handleDownload = () => {
    alert('Downloading report...');
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">Download Booking Report</h2>
      <button
        onClick={handleDownload}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg"
      >
        Download Report
      </button>
    </div>
  );
};

export default DownloadReport;
