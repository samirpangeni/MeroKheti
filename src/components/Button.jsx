import React,{} from 'react'
import {
  FiPackage,
  FiDollarSign,
  FiCalendar,
  FiAlignLeft,
  FiGrid,
  FiX,
  FiCheckCircle,
  FiMapPin,
  FiTruck,
  FiTag,
  FiBox,
} from "react-icons/fi";
const Button = ({ isSubmitting, setIsSubmitting, isValid }) => {
   
    return (
        <div>
            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                  ${isValid && !isSubmitting
                        ? "bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-[1.02]"
                        : "bg-gray-700 cursor-not-allowed opacity-50"
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Product...
                    </>
                ) : isValid ? (
                    <>
                        <FiCheckCircle className="w-5 h-5" />
                        List Product Now
                    </>
                ) : (
                    "Complete all required fields to list product"
                )}
            </button>
        </div>
    )
}

export default Button
