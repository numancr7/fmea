import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { hash } from 'bcryptjs';
import mongoose from 'mongoose';

export async function GET() {
  await connectToDatabase();
  try {
    const users = await User.find().select('-password').populate('team', 'name');
    // Map _id to id for frontend compatibility
    const usersWithId = users.map((u: any) => {
      const obj = u.toObject();
      obj.id = obj._id?.toString();
      delete obj._id;
      return obj;
    });
    return NextResponse.json(usersWithId);
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
    let teamId = undefined;
    if (team) {
      try {
        teamId = new mongoose.Types.ObjectId(team);
      } catch {
        return NextResponse.json({ error: 'Invalid team ID.' }, { status: 400 });
      }
    }
    const hashedPassword: string = await hash(userPassword, 10);
    const user: any = await User.create({ name, email, password: hashedPassword, role, team: teamId });
    // Fetch the user again with populated team
    const populatedUser = await User.findById(user._id).populate('team', 'name');
    if (!populatedUser) {
      return NextResponse.json({ error: 'Failed to fetch created user.' }, { status: 500 });
    }
    const userData: any = populatedUser.toObject();
    userData.id = userData._id?.toString();
    delete userData._id;
    delete userData.password;
    return NextResponse.json(userData, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 