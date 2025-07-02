import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMechanism from '@/models/FailureMechanism';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const failureMechanism = await FailureMechanism.findOne({ id: params.id });
    if (!failureMechanism) return NextResponse.json({ error: 'FailureMechanism not found' }, { status: 404 });
    return NextResponse.json(failureMechanism);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name } = await req.json();
  try {
    const failureMechanism = await FailureMechanism.findOneAndUpdate({ id: params.id }, { name }, { new: true });
    if (!failureMechanism) return NextResponse.json({ error: 'FailureMechanism not found' }, { status: 404 });
    return NextResponse.json(failureMechanism);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const failureMechanism = await FailureMechanism.findOneAndDelete({ id: params.id });
    if (!failureMechanism) return NextResponse.json({ error: 'FailureMechanism not found' }, { status: 404 });
    return NextResponse.json({ message: 'FailureMechanism deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 