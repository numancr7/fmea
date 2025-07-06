import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';
import jwt from 'jsonwebtoken';
import { handleApiError } from '@/lib/utils';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: '1h' }
    );

    // Set expiry time (1 hour from now)
    const expiryMs = process.env.RESET_TOKEN_EXPIRE ? parseInt(process.env.RESET_TOKEN_EXPIRE) : 3600000;
    const expiryDate = new Date(Date.now() + expiryMs);

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = expiryDate;
    await user.save();

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request for FMEA-Failure Mode Effect Analysis',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

 

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );

  } catch (error) {
    const { status, body } = handleApiError(error, 'Forgot Password');
    return NextResponse.json(body, { status });
  }
} 