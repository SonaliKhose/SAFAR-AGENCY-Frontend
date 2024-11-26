"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../modal/confirmation"; // Import your modal component

// Function to get user ID from token
const getUserIdFromToken = () => {
  const loginToken = sessionStorage.getItem("authToken");
  if (loginToken) {
    const payload = JSON.parse(atob(loginToken.split(".")[1]));
    return payload.userId;
  }
  return null;
};

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [carsPerPage] = useState(5); // Number of cars to show per page

  const [editCarId, setEditCarId] = useState(null);
  const [carData, setCarData] = useState({
    carName: "",
    carType: "",
    price: "",
    pricePerKm: "",
    image: null,
  });
  const [travelUserId, setTravelUserId] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState("All");
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const totalCars = filteredCars.length;
  const totalPages = Math.ceil(totalCars / carsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (carId) => {
    setCarToDelete(carId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCarToDelete(null);
  };

  useEffect(() => {
    const fetchedUserId = getUserIdFromToken();
    if (fetchedUserId) {
      setTravelUserId(fetchedUserId);
    } else {
      console.error("User ID not found in token");
    }
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      const loginToken = sessionStorage.getItem("authToken");
      if (travelUserId) {
        try {
          const res = await axios.get(
            `http://localhost:5000/cars/${travelUserId}`,
            {
              headers: {
                Authorization: `Bearer ${loginToken}`,
              },
            }
          );
          setCars(res.data);
          setFilteredCars(res.data);
        } catch (error) {
          console.error("Error fetching cars:", error);
        }
      }
    };
    fetchCars();
  }, [travelUserId]);

  useEffect(() => {
    const loginToken = sessionStorage.getItem("authToken");
    if (!loginToken) {
      router.push("/login"); // Redirect to login page if token is missing
    }
  }, [router]);

  useEffect(() => {
    // Filtering cars based on selected car type
    if (selectedCarType === "All") {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter((car) => car.carType === selectedCarType));
    }
  }, [selectedCarType, cars]);

  const handleInputChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCarData({ ...carData, image: e.target.files[0] });
  };

  // Function for validations
  const validateForm = () => {
    const errors = {};
    const { carName, carType, price, pricePerKm, image } = carData;

    if (!carName) errors.carName = "Car name is required";
    if (!carType) errors.carType = "Car type is required";
    if (!price || isNaN(price) || price < 0)
      errors.price = "Valid non-negative price is required";
    if (!pricePerKm || isNaN(pricePerKm) || pricePerKm < 0)
      errors.pricePerKm = "Valid non-negative price per Km is required";
    if (!image && !isEditing) errors.image = "Car image is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Function for creating car
  const handleCreateCar = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loginToken = sessionStorage.getItem("authToken");
    try {
      const formData = new FormData();
      formData.append("carName", carData.carName);
      formData.append("carType", carData.carType);
      formData.append("price", carData.price);
      formData.append("pricePerKm", carData.pricePerKm);
      formData.append("travelUserId", travelUserId);
      formData.append("image", carData.image);

      const res = await axios.post(
        "http://localhost:5000/cars/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${loginToken}`, // Include the token here
          },
        }
      );

      // Update both cars and filteredCars
      setCars([...cars, res.data]);
      if (selectedCarType === "All" || res.data.carType === selectedCarType) {
        setFilteredCars([...filteredCars, res.data]);
      }

      setFormVisible(false);
      resetForm();
      toast.success("Car added successfully!");
    } catch (error) {
      toast.error("Error creating car!");
      console.error("Error creating car:", error);
    }
  };

  // Function to delete cars
  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    const loginToken = sessionStorage.getItem("authToken");
    try {
      await axios.delete(`http://localhost:5000/cars/${carToDelete}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`, // Include the token here
        },
      });
      setCars(cars.filter((car) => car._id !== carToDelete));
      setFilteredCars(filteredCars.filter((car) => car._id !== carToDelete));
      toast.success("Car deleted successfully!");
      closeModal();
    } catch (error) {
      toast.error("Error deleting car!");
      console.error("Error deleting car:", error);
    }
  };

  const handleEditCar = (carId) => {
    const carToEdit = cars.find((car) => car._id === carId);
    if (carToEdit) {
      setCarData(carToEdit);
      setIsEditing(true);
      setEditCarId(carId); // Set the ID of the car being edited
      setFormVisible(true);
    }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loginToken = sessionStorage.getItem("authToken");
    try {
      const formData = new FormData();
      formData.append("carName", carData.carName);
      formData.append("carType", carData.carType);
      formData.append("price", carData.price);
      formData.append("pricePerKm", carData.pricePerKm);
      if (carData.image) {
        formData.append("image", carData.image); // Include image if it's updated
      }

      // Make an API request to update the car by ID
      const response = await axios.put(
        `http://localhost:5000/cars/${editCarId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${loginToken}`, // Include the token here
          },
        }
      );

      // Update the cars and filteredCars states
      setCars(cars.map((car) => (car._id === editCarId ? response.data : car)));
      setFilteredCars(
        filteredCars.map((car) => (car._id === editCarId ? response.data : car))
      );

      setFormVisible(false);
      setIsEditing(false); // Reset editing state
      setEditCarId(null); // Reset editCarId
      resetForm();
      toast.success("Car updated successfully!");
    } catch (error) {
      toast.error("Error updating car!");
      console.error("Error updating car:", error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCarData({
      carName: "",
      carType: "",
      price: "",
      pricePerKm: "",
      image: null,
    });
    setFormErrors({});
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Manage Cars of Your Travel!
      </h1>
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="flex justify-center mb-7 space-x-10">
        <button
          onClick={() => {
            setFormVisible((prevState) => !prevState);
            if (formVisible) resetForm();
          }}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-500 transition"
        >
          {formVisible ? "Cancel" : "Add New Car"}
        </button>

        {/* Car type filter */}
        {!formVisible && ( // Conditionally render the filter only when formVisible is false
          <div className="flex items-center">
            <label className="mr-4 text-blue-700 font-medium">
              Filter by Car Type:
            </label>
            <select
              value={selectedCarType}
              onChange={(e) => setSelectedCarType(e.target.value)}
              className="border border-blue-300 rounded-lg p-2"
            >
              <option value="All">All</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              {/* Add more options as needed */}
            </select>
          </div>
        )}
      </div>
      {/* Form for adding or editing a car */}
      {formVisible && (
        <form
          onSubmit={isEditing ? handleUpdateCar : handleCreateCar}
          className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg mb-6 border border-gray-300"
        >
          {["carName", "price", "pricePerKm"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-blue-700 font-medium mb-2">
                {field.replace(/([A-Z])/g, " $1").trim()}:
              </label>
              <input
                type={field.includes("price") ? "number" : "text"}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                value={carData[field]}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formErrors[field] && (
                <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
              )}
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-blue-700 font-medium mb-2">
              Car Type:
            </label>
            <select
              name="carType"
              value={carData.carType}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Car Type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              {/* Add more options as needed */}
            </select>
            {formErrors.carType && (
              <p className="text-red-500 text-sm mt-1">{formErrors.carType}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-blue-700 font-medium mb-2">
              Car Image:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-blue-300 rounded-lg"
            />
            {formErrors.image && (
              <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            {isEditing ? "Update Car" : "Create Car"}
          </button>
        </form>
      )}
      <div className="flex flex-wrap justify-center gap-6">
        {currentCars // Displaying cars using currentCars with pagination
          .filter((car) => (isEditing ? car._id === editCarId : true)) // Show only the card being edited
          .map((car) => (
            <div
              key={car._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex w-full max-w-[800px] border border-gray-200 transition hover:bg-blue-100 hover:shadow-xl"
            >
              <img
                src={car.image}
                alt={car.carName}
                className="w-1/3 h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {car.carName}
                  </h3>
                  <p className="text-gray-600 mb-1">Type: {car.carType}</p>
                  <p className="text-gray-600 mb-1">Price: {car.price}</p>
                  <p className="text-gray-600 mb-1">
                    Price per Km: {car.pricePerKm}
                  </p>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => handleEditCar(car._id)}
                    className="flex items-center justify-center bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-500 transition"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => openModal(car._id)}
                    className="flex items-center justify-center bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-500 transition"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Pagination controls */}
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteCar}
      />
    </div>
  );
};

export default CarsPage;
