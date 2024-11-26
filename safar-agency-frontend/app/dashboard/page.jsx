
"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import {  useEffect } from "react";


const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const loginToken = sessionStorage.getItem("authToken");
    if (!loginToken) {
      router.push("/login"); // Redirect to login page if token is missing
    }
  }, [router]);
  const services = [
    { title: 'Flight Booking', description: 'Easily book flights to your dream destinations with competitive rates and exclusive deals.' },
    { title: 'Hotel Reservations', description: 'Find and reserve comfortable accommodations worldwide, tailored to your budget and preferences.' },
    { title: 'Travel Insurance', description: 'Protect your travels with comprehensive insurance plans for peace of mind during your adventures.' },
  ];

  const destinations = [
    { name: 'Paris', img: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/03/1c/9c.jpg' },
    { name: 'New York', img: 'https://www.travelguide.net/media/new-york.jpeg' },
    { name: 'Tokyo', img: 'https://cdn.cheapoguides.com/wp-content/uploads/sites/2/2022/05/chureito-pagoda-fuji-GettyImages-901228728-1024x600.jpg' },
  ];

  const testimonials = [
    { name: 'John Doe', feedback: 'My trip was flawless thanks to Safar! Highly recommend their services.' },
    { name: 'Jane Smith', feedback: 'The booking process was simple and the support was excellent!' },
  ];
 

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-blue-800">Welcome to SAFAR </h1>
        <p className="mt-3 text-xl text-gray-600">Your adventure starts with us!</p>
      </header>

      {/* Featured Services Section */}
      <section className="mb-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-blue-700">{service.title}</h3>
              <p className="text-gray-500 mt-3">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="mb-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">Explore Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
              <div className="relative">
                <img src={destination.img} alt={destination.name} className="w-full h-48  object-cover" />
                <div className="absolute inset-0 bg-black opacity-40 "></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{destination.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">What Our Clients Say</h2>
        <ul className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <li key={index} className="bg-white p-6 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <p className="italic text-gray-700">"{testimonial.feedback}"</p>
              <p className="font-bold mt-3 text-blue-600">- {testimonial.name}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <p className="mb-4 text-lg text-gray-600">Ready to embark on your next adventure? Join us!</p>
        <a href="/login" className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Login
        </a>
        <span className="mx-2">or</span>
        <a href="/signup" className="bg-green-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
