import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { requireRole } from '@/lib/requireRole';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// GET: Get single user by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const user = await User.findOne({ id }).select('-password').populate('team', 'name');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update user by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Allow if admin or self-update
  const { id } = await params;
  if (session.user.role !== 'admin' && session.user.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectToDatabase();
  const { name, email, password, role, team, phone, address, avatar } = await req.json();
  try {
    let teamId = undefined;
    if (team) {
      try {
        teamId = new mongoose.Types.ObjectId(team);
      } catch {
        return NextResponse.json({ error: 'Invalid team ID.' }, { status: 400 });
      }
    }
    const updateFields: any = {
      name,
      email,
      phone,
      address,
      avatar,
    };
    if (password) updateFields.password = password;
    if (role && session.user.role === 'admin') updateFields.role = role;
    if (team && session.user.role === 'admin') updateFields.team = teamId;
    const user = await User.findOneAndUpdate({ _id: id }, updateFields, { new: true });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // Fetch the user again with populated team
    const populatedUser = await User.findById(user._id).populate('team', 'name');
    if (!populatedUser) {
      return NextResponse.json({ error: 'Failed to fetch updated user.' }, { status: 500 });
    }
    const userData: any = populatedUser.toObject();
    userData.id = userData._id?.toString();
    delete userData._id;
    delete userData.password;
    return NextResponse.json(userData);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove user by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 