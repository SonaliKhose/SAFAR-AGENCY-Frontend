"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/userContext";
import Link from "next/link";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const { email, password } = formData;

    // Email validation: simple regex for email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address";
    }

    // Password validation: check for empty password (optional: length check)
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
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
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token); // Call the login function from context to save token
        router.push("/"); // Redirect to home page after login
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96 transition-transform transform hover:scale-105"
      >
        <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">
          Log In
        </h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>
        <div className="mb-3 text-right">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-md hover:bg-gradient-to-l transition duration-300"
        >
          Log In
        </button>

        {/* Sign-up link */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?
            <a
              href="/signup"
              className="text-purple-600 hover:text-purple-800 transition ml-1"
            >
              Sign up here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
