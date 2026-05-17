import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const res = NextResponse.json({
      message: "Logged out successfully",
    });

    // IMPORTANT: properly clear cookie
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // immediately expire
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}