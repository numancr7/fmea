import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMechanism from '@/models/FailureMechanism';
import { requireRole } from '@/lib/requireRole';

// GET: Get single failure mechanism by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const mechanism = await FailureMechanism.findOne({ id: params.id });
    if (!mechanism) return NextResponse.json({ error: 'Failure Mechanism not found' }, { status: 404 });
    return NextResponse.json(mechanism);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update failure mechanism by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const mechanism = await FailureMechanism.findOneAndUpdate({ id: params.id }, data, { new: true });
    if (!mechanism) return NextResponse.json({ error: 'Failure Mechanism not found' }, { status: 404 });
    return NextResponse.json(mechanism);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove failure mechanism by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const mechanism = await FailureMechanism.findOneAndDelete({ id: params.id });
    if (!mechanism) return NextResponse.json({ error: 'Failure Mechanism not found' }, { status: 404 });
    return NextResponse.json({ message: 'Failure Mechanism deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 