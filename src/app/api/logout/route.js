import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST() {
  const response = NextResponse.json({ message: "logout successful"})
  response.cookies.set("token", "",{
      httpOnly: true,
      expires : new Date(0),
      path:"/"
    })
  return Response.json({
    message: "logout successful",
  });
}
