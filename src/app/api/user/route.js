import connectDB from "../../../../lib/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import Activity from "../../../../models/Activity";
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(
      decoded.userId || decoded.id || decoded._id,
    ).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "login successful",
      user: user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 },
    );
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const { firstName, lastName, mobile, email, password, role } =
      await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "user already exist",
        },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a role.",
        },
        { status: 400 }
      );
    }
    const response = NextResponse.json(
      { message: "User Create", success: true },
      { status: 201 },

    );

    response.cookies.set("token", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (err) {

    console.error("Registration error:", err);
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors);

      for (const error of errors) {
        if (error.path === "role") {
          return NextResponse.json(
            {
              success: false,
              message: "Please select a role.",
            },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: errors[0]?.message || "Please check your information.",
        },
        { status: 400 }
      );
    }

    // Duplicate email
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { currentPassword, password } = body;
    if (!currentPassword || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 },
      );
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId || decode.id || decode._id);
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    return NextResponse.json({ message: "Updated successfully" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}


