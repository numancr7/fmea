import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureCause from '@/models/FailureCause';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const failureCause = await FailureCause.findOne({ id });
    if (!failureCause) return NextResponse.json({ error: 'FailureCause not found' }, { status: 404 });
    return NextResponse.json(failureCause);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { causeName, causeCode, causeDescription } = await req.json();
  try {
    const { id } = await params;
    const failureCause = await FailureCause.findOneAndUpdate({ id }, { causeName, causeCode, causeDescription }, { new: true });
    if (!failureCause) return NextResponse.json({ error: 'FailureCause not found' }, { status: 404 });
    return NextResponse.json(failureCause);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const failureCause = await FailureCause.findOneAndDelete({ id });
    if (!failureCause) return NextResponse.json({ error: 'FailureCause not found' }, { status: 404 });
    return NextResponse.json({ message: 'FailureCause deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 