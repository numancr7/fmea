import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMechanism from '@/models/FailureMechanism';
import { requireRole } from '@/lib/requireRole';

// GET: Get single failure mechanism by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const mechanism = await FailureMechanism.findById(id);
    if (!mechanism) return NextResponse.json({ error: 'Failure Mechanism not found' }, { status: 404 });
    return NextResponse.json(mechanism);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update failure mechanism by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  try {
    const { id } = await params;
    const mechanism = await FailureMechanism.findByIdAndUpdate(id, { name }, { new: true });
    if (!mechanism) return NextResponse.json({ error: 'Failure Mechanism not found' }, { status: 404 });
    return NextResponse.json(mechanism);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove failure mechanism by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const mechanism = await FailureMechanism.findByIdAndDelete(id);
    if (!mechanism) return NextResponse.json({ error: 'Failure Mechanism not found' }, { status: 404 });
    return NextResponse.json({ message: 'Failure Mechanism deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 