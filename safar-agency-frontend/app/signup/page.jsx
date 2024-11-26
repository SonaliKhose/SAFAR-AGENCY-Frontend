// Frontend code (Signup component)
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const { username, email, password } = formData;

    if (username.trim().length < 3) {
      return 'Travel agency name must be at least 3 characters long';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address';
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
    if (!passwordPattern.test(password)) {
      return 'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage("Verification email sent! Please check your inbox.");
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setErrorMessage('Server error');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-[400px] transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-purple-600 text-center mb-4">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Travel Agency Name</label>
          <input
            type="text"
            placeholder="Enter name of your travel agency"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <button type="submit" className="mt-4 bg-purple-600 text-white py-2 rounded-md w-full hover:bg-purple-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}
