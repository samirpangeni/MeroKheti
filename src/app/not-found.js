import Link from "next/link";
import React from "react";

const NotFound =()=> {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        
        {/* Image */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/7559/7559747.png"
          alt="404 not found"
          className="w-40 mx-auto mb-6 opacity-90"
        />

        {/* Big 404 */}
        <h1 className="text-7xl font-extrabold text-gray-800">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-3">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
export default NotFound