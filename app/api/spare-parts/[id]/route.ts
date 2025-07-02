import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SparePart from '@/models/SparePart';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const sparePart = await SparePart.findOne({ id: params.id });
    if (!sparePart) return NextResponse.json({ error: 'SparePart not found' }, { status: 404 });
    return NextResponse.json(sparePart);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { materialNo, description, proposedStock, currentStock, price, minStock, maxStock, status, equipmentTypeIds } = await req.json();
  try {
    const sparePart = await SparePart.findOneAndUpdate({ id: params.id }, { materialNo, description, proposedStock, currentStock, price, minStock, maxStock, status, equipmentTypeIds }, { new: true });
    if (!sparePart) return NextResponse.json({ error: 'SparePart not found' }, { status: 404 });
    return NextResponse.json(sparePart);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const sparePart = await SparePart.findOneAndDelete({ id: params.id });
    if (!sparePart) return NextResponse.json({ error: 'SparePart not found' }, { status: 404 });
    return NextResponse.json({ message: 'SparePart deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 