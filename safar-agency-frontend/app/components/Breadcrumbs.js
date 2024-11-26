"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumbs = () => {
  const pathname = usePathname(); // Get current path
  const pathArray = pathname.split('/').filter((path) => path); // Split path into array

  // Dynamically generate the path for each breadcrumb
  const generateBreadcrumbs = () => {
    return pathArray.map((path, index) => {
      const isLast = index === pathArray.length - 1; // Check if it's the last item
      const pathLink = `/${pathArray.slice(0, index + 1).join('/')}`; // Create path link

      return (
        <li key={index} className="flex items-center">
          {!isLast ? (
            <>
              <Link href={pathLink} className="text-blue-600 hover:underline capitalize">
                {formatPathName(path)}
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : (
            <span className="text-gray-500 capitalize">{formatPathName(path)}</span>
          )}
        </li>
      );
    });
  };

  // Capitalize and format the breadcrumb text
  const formatPathName = (path) => {
    return path.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <nav className="bg-gray-100 py-3 rounded mb-4 shadow">
      <div className="max-w-7xl mx-auto px-4">
        <ol className="flex space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            {pathArray.length > 0 && <span className="mx-2">/</span>}
          </li>
          {generateBreadcrumbs()}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
