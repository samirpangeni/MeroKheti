"use client";
import React from "react";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import axios from "axios";
import Link from "next/link";
const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [strength, setStrength] = useState("");

  const checkPassword = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-za-z0-9]/)) score++;
    if (score <= 2) return "weak";
    if (score === 3 || score === 4) return "medium";
    return "strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, password, mobile);
    if (password !== confirmPassword) {
      alert("password do not match");
      return;
    }
    try {
      const response = await axios.post("/api/user", {
        firstName,
        lastName,
        email,
        password,
        mobile,
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setMobile("");

    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handelMobile = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    mobile.trim() &&
    password &&
    confirmPassword &&
    password === confirmPassword;
  return (
    <div
      style={{
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA5NC9KFShrhiVRIwmN7d-0Nc7kttja27IwA&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen w-full flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10 px-6">
        {/* LEFT TEXT SECTION */}
        <div className="text-center md:text-left text-white md:w-1/2">
          <h1 className="text-5xl font-mono font-bold">Merokheti</h1>
          <p className="mt-4 text-gray-200 text-lg">
            Now vegetables and fruits directly from the farm to your table
          </p>
        </div>

        {/* RIGHT FORM SECTION */}
        <form
          className="w-full md:w-1/2 p-6 rounded-2xl shadow-lg border bg-white/10 backdrop-blur-2xl"
          onSubmit={handleSubmit}
        >
          <div className="">
            <h1 className="text-center text-2xl">Sing up</h1>

            <div className="flex flex-col mb-3 ">
              {/*FirstName */}
              <label htmlFor="firstName" className="mb-1 text-sm font-medium">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="Enter First name"
                className="p-2 border-b-2  focus:outline-none focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-0 mb-3"
              />

              {/*LastName */}
              <label htmlFor="lastName" className="mb-1 text-sm font-medium">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Enter last name"
                className="border-b-2    outline-none p-2 focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-0"
              />
            </div>

            {/* Email*/}
            <div className="mb-3">
              <label htmlFor="email" className="mb-1 text-sm font-medium">
                Email:
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="border-b-2  outline-none p-2 w-full focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-0"
              />
            </div>

            {/*Mobile */}
            <div className="mb-3">
              <label htmlFor="mobile" className="mb-1 text-sm font-medium">
                Mobile:
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                id="mobile"
                onChange={handelMobile}
                value={mobile}
                placeholder="Enter mobile number"
                className="border-b-2 outline-none p-2 w-full focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-0"
              />
              {mobile && !/^\d+$/.test(mobile) && (
                <p className="text-red-500 text-sm">only number are allowed</p>
              )}
            </div>

            {/*Password */}
            <div className="mb-3 relative">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setStrength(checkPassword(value));
                }}
                id="password"
                value={password}
                placeholder="Enter password"
                className="border-b-2 outline-none p-2 w-full focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-0"
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-2 top-2/3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p
              className={`text-sm mt-1 ${
                strength === "weak"
                  ? "text-red-500"
                  : strength === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              {strength && `${strength}`}
            </p>
            <div>
              <ul>
                <li
                  className={` ${password.length >= 8 ? "text-green-500" : "text-red-500"}
              `}
                >
                  {" "}
                  At least 8 characters
                </li>
                <li
                  className={`${password.match(/[A-Z]/) ? "text-green-500" : "text-red-500"}`}
                >
                  One Uppercase letter
                </li>
                <li
                  className={`${password.match(/[0-9]/) ? "text-green-500" : "text-red-500"}`}
                >
                  At least one number
                </li>
                <li
                  className={`${password.match(/[^A-Za-z0-9]/) ? "text-green-500" : "text-red-500"}`}
                >
                  one special character
                </li>
              </ul>
            </div>
            {/*ConfirmPassword */}
            <div className="mb-3 relative">
              <label
                htmlFor="confirmPassword"
                className="mb-1 text-sm font-medium"
              >
                Confirm password:
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm password"
                className={`border-b-2 outline-none p-2 w-full focus:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-0
                 ${confirmPassword.length === 0 ? "border-gray-300 focus:ring-blue-500" : isMatch ? "border-green-500 focus:ring-green-500" : "border-red-500 focus:ring-red-500"}`}
              />
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(!showConfirm);
                }}
                className="absolute right-2 top-2/3 -translate-y-1/2"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="border-2 rounded-lg w-full p-2 bg-blue-600 hover:bg-blue-500 focus:bg-green-500"
                disabled={!isValid || strength === "weak"}
              >
                Submit
              </button>
            </div>
          </div>
          <p className="text-center text-sm mt-4">
            Already have account{" "}
            <Link href="/login">
              <span className="text-blue-600 hover:underline">Log in</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default page;
