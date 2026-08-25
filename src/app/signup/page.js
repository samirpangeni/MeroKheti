"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import PasswordUI from "@/components/PasswordUI";
import ConfirmPassword from "@/components/ConfirmPassword";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [strength, setStrength] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/api/user", {
        firstName,
        lastName,
        email,
        password,
        mobile,
        role,
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setMobile("");

      if (res.data.success) {
        toast.success("your account is successfully create");
        router.push("/")
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

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
    <div className="min-h-screen bg-linear-to-br from-background via-secondary to-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500/20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full"></div>

      {/* SIGNUP CARD */}
      <div className="w-full max-w-2xl bg-foreground/5 border border-border backdrop-blur-xl rounded-2xl p-8 shadow-xl">
        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Mero</span>Kheti
          </h1>
          <p className="text-muted text-sm mt-2">
            Join the fresh farm marketplace 🌿
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME ROW */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-input border border-border focus:border-primary-hover outline-none"
                placeholder="John"
              />
            </div>

            <div>
              <label className="text-xs text-muted">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-card border border-border focus:border-primary-hover outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-card border border-border focus:border-primary-hover outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="text-xs text-muted">Mobile</label>
            <input
              type="tel"
              value={mobile}
              onChange={handelMobile}
              className="w-full mt-1 p-3 rounded-xl bg-card border border-border focus:border-primary-hover outline-none"
              placeholder="98XXXXXXXX"
            />
            {mobile && !/^\d+$/.test(mobile) && (
              <p className="text-red-400 dark:text-red-600 text-xs mt-1">Only numbers allowed</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted ">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-3 p-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`border rounded-xl p-3 transition-all duration-200 ${role === "customer"
                  ? "bg-primary text-foreground border-border"
                  : "bg-background text-foreground border-border hover:border-border-hover"
                  }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">🛒</span>
                  <span className="font-medium">Customer</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("farmer")}
                className={`border rounded-xl p-3 transition-all duration-200 ${role === "farmer"
                  ? "bg-primary text-foreground border-border"
                  : "bg-background text-foreground border-border hover:border-border"
                  }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">🌾</span>
                  <span className="font-medium">Farmer</span>
                </div>
              </button>
            </div>
          </div>
          {/* PASSWORD COMPONENT */}
          <PasswordUI
            strength={strength}
            password={password}
            setShowPassword={setShowPassword}
            setPassword={setPassword}
            setStrength={setStrength}
            showPassword={showPassword}
          />

          {/* CONFIRM PASSWORD */}
          <ConfirmPassword
            confirmPassword={confirmPassword}
            setShowConfirm={setShowConfirm}
            setConfirmPassword={setConfirmPassword}
            showConfirm={showConfirm}
            password={password}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!isValid || strength === "weak"}
            className="w-full py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary-hover transition disabled:opacity-50"
          >
            Create Account
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-muted mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
