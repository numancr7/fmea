import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMechanism from '@/models/FailureMechanism';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const failureMechanisms = await FailureMechanism.find();
    return NextResponse.json(failureMechanisms);
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
    const exists = await FailureMechanism.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'FailureMechanism ID already exists.' }, { status: 409 });
    }
    const failureMechanism = await FailureMechanism.create({ id, name });
    return NextResponse.json(failureMechanism, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 