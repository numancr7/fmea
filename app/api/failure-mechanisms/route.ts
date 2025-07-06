import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMechanism from '@/models/FailureMechanism';
import { requireRole } from '@/lib/requireRole';

// GET: List all failure mechanisms
export async function GET() {
  await connectToDatabase();
  try {
    const mechanisms = await FailureMechanism.find();
    return NextResponse.json(mechanisms);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new failure mechanism
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const exists = await FailureMechanism.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Failure Mechanism ID already exists.' }, { status: 409 });
    }
    const mechanism = await FailureMechanism.create(data);
    return NextResponse.json(mechanism, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 