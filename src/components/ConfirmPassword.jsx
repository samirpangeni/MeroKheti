import React from "react";
import { EyeOff, Eye, CheckCircle2, XCircle } from "lucide-react";

const ConfirmPassword = ({
  confirmPassword,
  setConfirmPassword,
  setShowConfirm,
  showConfirm,
  password,
}) => {
  const isMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="w-full">
      <label
        htmlFor="confirmPassword"
        className="block mb-3 text-green-200 font-medium"
      >
        Confirm Password
      </label>

      <div
        className={`relative overflow-hidden rounded-2xl border 
          
          ${
            confirmPassword.length === 0
              ? "border-green-800 bg-black/20"
              : isMatch
              ? "border-green-500 bg-green-500/10"
              : "border-red-500 bg-red-500/10"
          }
        `}
      >
        <input
          type={showConfirm ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="w-full bg-transparent p-4 pr-24 outline-none text-white placeholder:text-gray-400"
        />

        {/* Status Icon */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          {confirmPassword.length > 0 &&
            (isMatch ? (
              <CheckCircle2
                size={20}
                className="text-green-400"
              />
            ) : (
              <XCircle size={20} className="text-red-400" />
            ))}
        </div>

        {/* Eye Button */}
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-all"
        >
          {showConfirm ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {/* Helper Text */}
      {confirmPassword.length > 0 && (
        <p
          className={`mt-2 text-sm font-medium ${
            isMatch ? "text-green-400" : "text-red-400"
          }`}
        >
          {isMatch
            ? "Passwords match"
            : "Passwords do not match"}
        </p>
      )}
    </div>
  );
};

export default ConfirmPassword;