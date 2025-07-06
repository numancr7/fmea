import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import System from '@/models/System';
import { requireRole } from '@/lib/requireRole';

// GET: Get single system by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const system = await System.findOne({ id });
    if (!system) return NextResponse.json({ error: 'System not found' }, { status: 404 });
    return NextResponse.json(system);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update system by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const system = await System.findOneAndUpdate({ id }, data, { new: true });
    if (!system) return NextResponse.json({ error: 'System not found' }, { status: 404 });
    return NextResponse.json(system);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove system by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const system = await System.findOneAndDelete({ id });
    if (!system) return NextResponse.json({ error: 'System not found' }, { status: 404 });
    return NextResponse.json({ message: 'System deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 