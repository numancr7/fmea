import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP is:  <b>${otp}</b></p>`,
  });

  return NextResponse.json({ message: "OTP sent" });
} 