import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-screen bg-green-950 md:pl-70">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>

        {/* Animated arc */}
        <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

        {/* Inner dot */}
        <div className="absolute inset-4 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;