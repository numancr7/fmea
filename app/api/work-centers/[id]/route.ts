import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkCenter from '@/models/WorkCenter';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const workCenter = await WorkCenter.findOne({ id: params.id });
    if (!workCenter) return NextResponse.json({ error: 'WorkCenter not found' }, { status: 404 });
    return NextResponse.json(workCenter);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name } = await req.json();
  try {
    const workCenter = await WorkCenter.findOneAndUpdate({ id: params.id }, { name }, { new: true });
    if (!workCenter) return NextResponse.json({ error: 'WorkCenter not found' }, { status: 404 });
    return NextResponse.json(workCenter);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const workCenter = await WorkCenter.findOneAndDelete({ id: params.id });
    if (!workCenter) return NextResponse.json({ error: 'WorkCenter not found' }, { status: 404 });
    return NextResponse.json({ message: 'WorkCenter deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 