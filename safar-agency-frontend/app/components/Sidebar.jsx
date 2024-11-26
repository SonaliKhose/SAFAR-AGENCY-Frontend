"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaCar,
  FaCarAlt,
  FaBook,
  FaBell,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);

  const handleLinkClick = (event, path) => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      event.preventDefault(); // Prevent default link behavior
      setShowMessage(true); // Show the login message
      router.push("/login"); // Redirect to login page
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    return () => clearTimeout(timer);
  }, [showMessage]);

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-purple-900 shadow-xl text-white fixed top-16 left-0 flex flex-col justify-between">
      <ul className="mt-8 space-y-4">
        {showMessage && (
          <li className="bg-red-600 text-white text-center py-2">
            You need to log in first!
          </li>
        )}
        <li className={pathname === "/" ? "font-bold" : ""}>
          <Link href="/" onClick={(e) => handleLinkClick(e, "/")}>
            <span
              className={`flex items-center py-3 px-8 rounded transition-all duration-300 ${
                pathname === "/"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-md"
              }`}
            >
              <FaHome className="mr-3 text-lg" />
              Dashboard
            </span>
          </Link>
        </li>
        <li className={pathname === "/traveldetails" ? "font-bold" : ""}>
          <Link
            href="/traveldetails"
            onClick={(e) => handleLinkClick(e, "/traveldetails")}
          >
            <span
              className={`flex items-center py-3 px-8 rounded transition-all duration-300 ${
                pathname === "/traveldetails"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-md"
              }`}
            >
              <FaCarAlt className="mr-3 text-lg" />
              Travel Details
            </span>
          </Link>
        </li>
        <li className={pathname === "/cardetails" ? "font-bold" : ""}>
          <Link
            href="/cardetails"
            onClick={(e) => handleLinkClick(e, "/cardetails")}
          >
            <span
              className={`flex items-center py-3 px-8 rounded transition-all duration-300 ${
                pathname === "/cardetails"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-md"
              }`}
            >
              <FaCar className="mr-3 text-lg" />
              Car Details
            </span>
          </Link>
        </li>
        <li className={pathname === "/bookings" ? "font-bold" : ""}>
          <Link
            href="/bookings"
            onClick={(e) => handleLinkClick(e, "/bookings")}
          >
            <span
              className={`flex items-center py-3 px-8 rounded transition-all duration-300 ${
                pathname === "/bookings"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-md"
              }`}
            >
              <FaBook className="mr-3 text-lg" />
              Booking Details
            </span>
          </Link>
        </li>
        <li className={pathname === "/notifications" ? "font-bold" : ""}>
          <Link
            href="/notifications"
            onClick={(e) => handleLinkClick(e, "/notifications")}
          >
            <span
              className={`flex items-center py-3 px-8 rounded transition-all duration-300 ${
                pathname === "/notifications"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-md"
              }`}
            >
              <FaBell className="mr-3 text-lg" />
              Notifications
            </span>
          </Link>
        </li>
        <li className={pathname === "/paymentdetails" ? "font-bold" : ""}>
          <Link
            href="/paymentdetails"
            onClick={(e) => handleLinkClick(e, "/paymentdetails")}
          >
            <span
              className={`flex items-center py-3 px-8 rounded transition-all duration-300 ${
                pathname === "/paymentdetails"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-lg"
                  : "text-gray-300 hover:bg-purple-700 hover:text-white hover:shadow-md"
              }`}
            >
              <FaMoneyBillWave className="mr-3 text-lg" />
              Payment Details
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
