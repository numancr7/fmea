import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureCause from '@/models/FailureCause';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const failureCause = await FailureCause.findOne({ id: params.id });
    if (!failureCause) return NextResponse.json({ error: 'FailureCause not found' }, { status: 404 });
    return NextResponse.json(failureCause);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { causeName, causeCode, causeDescription } = await req.json();
  try {
    const failureCause = await FailureCause.findOneAndUpdate({ id: params.id }, { causeName, causeCode, causeDescription }, { new: true });
    if (!failureCause) return NextResponse.json({ error: 'FailureCause not found' }, { status: 404 });
    return NextResponse.json(failureCause);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const failureCause = await FailureCause.findOneAndDelete({ id: params.id });
    if (!failureCause) return NextResponse.json({ error: 'FailureCause not found' }, { status: 404 });
    return NextResponse.json({ message: 'FailureCause deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 