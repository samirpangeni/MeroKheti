import connectDB from "../../../../lib/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import Activity from "../../../../models/Activity";
export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }
    const token = jwt.sign(
      {
        userId: user._id, email: user.email, role: user.role, isSuspended: user.suspended,
        suspendUntil: user.suspendedUntil,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    await Activity.create({
      message: `${user.firstName} logged in`,
      type: "login"
    })
    const response = NextResponse.json({
      message: "login successful",
      user: {
        role: user.role,
        firstName: user.firstName,
        email: user.email,

      },
    });
    response.cookies.set("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err) {
    console.log(err);
    return Response.json({ message: "err" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    if (user.suspended) {
      return NextResponse.json(
        {
          message: "Your account has been suspended.",
          suspendedUntil: user.suspendedUntil,
          reason: user.suspendedReason,
        },
        { status: 403 }
      );
    }
    // Automatically unsuspend if expired
    if (
      user.suspended &&
      user.suspendedUntil &&
      new Date() >= user.suspendedUntil
    ) {
      user.suspended = false;
      user.suspendedReason = "";
      user.suspendedUntil = null;

      await user.save();
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}