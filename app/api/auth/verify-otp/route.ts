import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
// import { signJwt } from "@/lib/utils"; // If you want to issue a JWT

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, otp } = await req.json();
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  user.otp = null;
  user.otpExpiry = null;
  user.emailVerified = true;
  await user.save();

  // Create a session cookie for the user using NextAuth
  // We simulate a credentials login by calling the session callback
  // and setting the session cookie manually
  const sessionUser = {
    id: (user as any)._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };

  // Create a JWT token using the same logic as NextAuth
  // (You may want to use a JWT library or NextAuth's internal logic)
  // For now, just return success and let the frontend call signIn
  return NextResponse.json({ message: "OTP verified, login successful", user: sessionUser });
} 