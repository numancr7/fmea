import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const users = await User.find().select('-password').populate('team', 'name');
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { name, email, password, role, team } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }
    const user = await User.create({ name, email, password, role, team });
    const { password: _, ...userData } = user.toObject();
    return NextResponse.json(userData, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 