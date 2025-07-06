import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkCenter from '@/models/WorkCenter';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const workCenter = await WorkCenter.findOne({ id });
    if (!workCenter) return NextResponse.json({ error: 'WorkCenter not found' }, { status: 404 });
    return NextResponse.json(workCenter);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name } = await req.json();
  try {
    const { id } = await params;
    const workCenter = await WorkCenter.findOneAndUpdate({ id }, { name }, { new: true });
    if (!workCenter) return NextResponse.json({ error: 'WorkCenter not found' }, { status: 404 });
    return NextResponse.json(workCenter);
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
    const workCenter = await WorkCenter.findOneAndDelete({ id });
    if (!workCenter) return NextResponse.json({ error: 'WorkCenter not found' }, { status: 404 });
    return NextResponse.json({ message: 'WorkCenter deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 