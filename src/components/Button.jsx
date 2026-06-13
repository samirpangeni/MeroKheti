import React from "react";
import { FiCheckCircle } from "react-icons/fi";
const Button = ({ isSubmitting, isValid }) => {
  return (
    <div>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden border-green-600
          ${
            isValid && !isSubmitting
              ? "bg-linear-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-[1.02] text-white"
              : "bg-black/40 border border-green-900/40 text-gray-500 cursor-not-allowed opacity-60"
          }
        `}
      >
        {/* Glow effect */}
        {isValid && !isSubmitting && (
          <span className="absolute inset-0 bg-green-500/10 blur-2xl opacity-40" />
        )}

        {/* Loading state */}
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Adding Product...</span>
          </>
        ) : isValid ? (
          <>
            <FiCheckCircle className="w-5 h-5" />
            <span>List Product Now</span>
          </>
        ) : (
          <span>Complete all required fields</span>
        )}
      </button>

      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Make sure all required fields are filled before submitting
      </p>
    </div>
  );
};

export default Button;