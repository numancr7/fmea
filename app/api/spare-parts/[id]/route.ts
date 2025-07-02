import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SparePart from '@/models/SparePart';
import { requireRole } from '@/lib/requireRole';

// GET: Get single spare part by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const sparePart = await SparePart.findOne({ id: params.id });
    if (!sparePart) return NextResponse.json({ error: 'Spare Part not found' }, { status: 404 });
    return NextResponse.json(sparePart);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update spare part by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const sparePart = await SparePart.findOneAndUpdate({ id: params.id }, data, { new: true });
    if (!sparePart) return NextResponse.json({ error: 'Spare Part not found' }, { status: 404 });
    return NextResponse.json(sparePart);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove spare part by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const sparePart = await SparePart.findOneAndDelete({ id: params.id });
    if (!sparePart) return NextResponse.json({ error: 'Spare Part not found' }, { status: 404 });
    return NextResponse.json({ message: 'Spare Part deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 