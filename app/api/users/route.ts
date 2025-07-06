import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { hash } from 'bcryptjs';

export async function GET() {
  await connectToDatabase();
  try {
    const users = await User.find().select('-password').populate('team', 'name');
    return NextResponse.json(users);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name, email, password: userPassword, role, team } = await req.json();

  if (!name || !email || !userPassword) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }
    const hashedPassword: string = await hash(userPassword, 10);
    const user: any = await User.create({ name, email, password: hashedPassword, role, team });
    const userData: any = user.toObject();
    const { password, ...userWithoutPassword } = userData;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 