import React from "react";
import {
  EyeOff,
  Eye,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const PasswordUI  = ({
  showPassword,
  setPassword,
  password,
  setShowPassword,
  strength,
  setStrength,
}) => {
  const checkPassword = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    if (score <= 2) return "weak";
    if (score === 3 || score === 4) return "medium";

    return "strong";
  };

  const strengthColor =
    strength === "weak"
      ? "bg-red-500"
      : strength === "medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor="password"
        className="block mb-3 text-green-200 font-medium"
      >
        New Password
      </label>

      {/* Input */}
      <div className="relative rounded-2xl border border-green-800 bg-black/20  focus-within:border-green-500">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400">
          <ShieldCheck size={20} />
        </div>

        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          placeholder="Create a strong password"
          onChange={(e) => {
            const value = e.target.value;

            setPassword(value);
            setStrength(checkPassword(value));
          }}
          className="w-full bg-transparent py-4 pl-12 pr-14 outline-none text-white placeholder:text-gray-400"
        />

        {/* Eye Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-all"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {/* Strength */}
      {password.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-300">
              Password Strength
            </p>

            <span
              className={`text-sm font-semibold capitalize
                ${
                  strength === "weak"
                    ? "text-red-400"
                    : strength === "medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }
              `}
            >
              {strength}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${strengthColor}
                ${
                  strength === "weak"
                    ? "w-1/3"
                    : strength === "medium"
                    ? "w-2/3"
                    : "w-full"
                }
              `}
            />
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="mt-5 space-y-3">
        <div
          className={`flex items-center gap-2 text-sm
            ${
              password.length >= 8
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {password.length >= 8 ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}

          <span>At least 8 characters</span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm
            ${
              password.match(/[A-Z]/)
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {password.match(/[A-Z]/) ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}

          <span>One uppercase letter</span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm
            ${
              password.match(/[0-9]/)
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {password.match(/[0-9]/) ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}

          <span>At least one number</span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm
            ${
              password.match(/[^A-Za-z0-9]/)
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {password.match(/[^A-Za-z0-9]/) ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}

          <span>One special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordUI;