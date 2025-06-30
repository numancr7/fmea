import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/mailer';

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const validationResult = passwordUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
    }
    const { currentPassword, newPassword } = validationResult.data;
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }
    user.password = newPassword;
    await user.save();
    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Your FMEA password was changed',
      html: `<p>Your password was successfully changed. If you did not perform this action, please contact support immediately.</p>`
    });
    return NextResponse.json({ message: 'Password updated and verification email sent.' }, { status: 200 });
  } catch (error) {
    const { status, body } = handleApiError(error, 'Password Update');
    return NextResponse.json(body, { status });
  }
} 