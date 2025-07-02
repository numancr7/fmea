import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkCenter from '@/models/WorkCenter';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const workCenters = await WorkCenter.find();
    return NextResponse.json(workCenters);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, name } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'ID and name are required.' }, { status: 400 });
  }

  try {
    const exists = await WorkCenter.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'WorkCenter ID already exists.' }, { status: 409 });
    }
    const workCenter = await WorkCenter.create({ id, name });
    return NextResponse.json(workCenter, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 