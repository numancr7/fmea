import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SparePart from '@/models/SparePart';
import { requireRole } from '@/lib/requireRole';

// GET: Get single spare part by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const sparePart = await SparePart.findOne({ id });
    if (!sparePart) return NextResponse.json({ error: 'Spare part not found' }, { status: 404 });
    return NextResponse.json(sparePart);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update spare part by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const sparePart = await SparePart.findOneAndUpdate({ id }, data, { new: true });
    if (!sparePart) return NextResponse.json({ error: 'Spare part not found' }, { status: 404 });
    return NextResponse.json(sparePart);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove spare part by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const sparePart = await SparePart.findOneAndDelete({ id });
    if (!sparePart) return NextResponse.json({ error: 'Spare part not found' }, { status: 404 });
    return NextResponse.json({ message: 'Spare part deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 