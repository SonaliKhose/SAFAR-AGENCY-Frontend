"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

// Function to decode token and extract user ID
const gettravelUserIdFromToken = () => {
  const loginToken = sessionStorage.getItem("authToken"); 
  if (loginToken) {
    const payload = JSON.parse(atob(loginToken.split('.')[1])); 
    return payload.userId; 
  }
  return null;
};

const TravelDetailsForm = () => {
  const [travel, setTravel] = useState({
    logo: null,
    name: "",
    email: "",
    contactNo: "",
    city: "",
    state: "",
    address: "",
    country: "",
    pincode: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({}); // For storing validation errors
  const router = useRouter();

  // useEffect(() => {
  //   const loginToken = sessionStorage.getItem("authToken");
  //   if (!loginToken) {
  //     router.push("/login"); // Redirect to login page if token is missing
  //   }
  // }, [router]);

  // Fetch travel data when the component mounts
  useEffect(() => {
    const fetchTravelData = async () => {
      const travelUserId = gettravelUserIdFromToken(); // Get travelUserId from token
      if (travelUserId) {
        try {
          const token = sessionStorage.getItem("authToken"); // Retrieve token for authorization
          const response = await axios.get(`http://localhost:5000/travel/${travelUserId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.length > 0) {
            const travelData = response.data[0]; // Assuming you want the first travel record
            setTravel(travelData);
            setEditMode(true);
          }
        } catch (error) {
          console.error("Error fetching travel data:", error);
        }
      }
    };

    fetchTravelData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTravel((prevTravel) => ({
      ...prevTravel,
      [name]: value,
    }));

    // Clear error for the field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateFields = () => {
    let newErrors = {};
    const { name, email, contactNo, city, state, address, country, pincode } = travel;

    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!contactNo) {
      newErrors.contactNo = "Contact No is required";
    } else if (!/^\d{10}$/.test(contactNo)) {
      newErrors.contactNo = "Contact No must be a 10-digit number";
    }
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!address) newErrors.address = "Address is required";
    if (!country) newErrors.country = "Country is required";
    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be a 6-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const travelUserId = gettravelUserIdFromToken(); // Get travelUserId from token

    if (!validateFields()) return; // Validate fields before submitting

    try {
      const formData = new FormData();
      if (file) formData.append("logo", file);

      // Append other travel fields to form data
      Object.entries(travel).forEach(([key, value]) => {
        formData.append(key, value);
      });

      let response;
      if (editMode) {
        // Use PUT for update
        response = await axios.put(`http://localhost:5000/travel/${travelUserId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Travel details updated successfully!");
      } else {
        // Use POST for creating new entry
        formData.append("travelUserId", travelUserId); // Include travelUserId in the request
        response = await axios.post("http://localhost:5000/travel", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Travel agency created successfully!");
      }

      // Update state with new travel data
      const { _id, createdAt, updatedAt, __v, ...filteredTravelData } = response.data;
      setTravel(filteredTravelData);
      setEditMode(true); // Switch to edit mode after creation
    } catch (error) {
      console.error("Error updating travel details:", error.response?.data);
      toast.error("Failed to update travel details."); // Notify user of the error
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <ToastContainer />
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-md mb-10">
        <h2 className="text-3xl font-semibold text-center mb-4">Welcome to the Travel Agency Portal!</h2>
        <p className="text-center text-lg">
          Please fill out the form below to create or update your travel agency information.
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-blue-700 text-3xl font-bold text-center mb-6">
          {editMode ? "Edit Travel Details" : "Create Travel Agency"}
        </h2>
        <div className="flex flex-col items-center mb-8">
          {travel.logo ? (
            <img
              src={travel.logo} // Use the logo URL directly
              alt="Travel Logo"
              className="w-24 h-24 object-cover rounded-full border-4 border-blue-500 shadow-md"
            />
          ) : (
            <p className="text-gray-600 mb-2">No logo available</p>
          )}
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:bg-blue-600 file:text-white file:rounded-lg file:border-0 hover:file:bg-purple-700 transition cursor-pointer"
          />
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-blue-700 font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={travel.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className={`w-full p-3 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={travel.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className={`w-full p-3 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">Contact No:</label>
            <input
              type="text"
              name="contactNo"
              value={travel.contactNo}
              onChange={handleChange}
              placeholder="Enter Contact No"
              className={`w-full p-3 rounded-lg border ${
                errors.contactNo ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">City:</label>
            <input
              type="text"
              name="city"
              value={travel.city}
              onChange={handleChange}
              placeholder="Enter City"
              className={`w-full p-3 rounded-lg border ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">State:</label>
            <input
              type="text"
              name="state"
              value={travel.state}
              onChange={handleChange}
              placeholder="Enter State"
              className={`w-full p-3 rounded-lg border ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">Address:</label>
            <textarea
              name="address"
              value={travel.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className={`w-full p-3 rounded-lg border ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">Country:</label>
            <input
              type="text"
              name="country"
              value={travel.country}
              onChange={handleChange}
              placeholder="Enter Country"
              className={`w-full p-3 rounded-lg border ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={travel.pincode}
              onChange={handleChange}
              placeholder="Enter Pincode"
              className={`w-full p-3 rounded-lg border ${
                errors.pincode ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
            >
              {editMode ? "Update Travel Details" : "Create Travel Agency"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelDetailsForm;
