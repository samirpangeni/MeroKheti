import { NextResponse } from "next/server.js";
import connectDB from "../../../../../lib/mongoose.js";
import User from "../../../../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    await connectDB();

    // TOKEN
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // VERIFY TOKEN
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // FIND USER
    const user = await User.findById(decode.id || decode.userId || decode._id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // BODY
    const body = await req.json();

    const { firstName, lastName, email, mobile, oldPassword, newPassword } =
      body;

    // UPDATE FIELDS
    if (firstName) user.firstName = firstName;

    if (lastName) user.lastName = lastName;

    if (email) user.email = email;

    if (mobile) user.mobile = mobile;

    // PASSWORD CHANGE
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return NextResponse.json(
          { message: "Old password incorrect" },
          { status: 401 },
        );
      }

      // HASH NEW PASSWORD
      const hashPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashPassword;
    }

    // SAVE USER
    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
