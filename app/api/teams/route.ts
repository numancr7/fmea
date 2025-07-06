import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Team from '@/models/Team';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const teams = await Team.find().populate('members', 'name email role');
    return NextResponse.json(teams);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description, members } = await req.json();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Name is required and must be at least 2 characters.' }, { status: 400 });
  }

  try {
    const exists = await Team.findOne({ name });
    if (exists) {
      return NextResponse.json({ error: 'Team name already exists.' }, { status: 409 });
    }
    const team = await Team.create({ name, description, members });
    return NextResponse.json(team, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 