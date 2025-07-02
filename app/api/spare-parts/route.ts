import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SparePart from '@/models/SparePart';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const spareParts = await SparePart.find();
    return NextResponse.json(spareParts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, materialNo, description, proposedStock, currentStock, price, minStock, maxStock, status, equipmentTypeIds } = await req.json();

  if (!id || !materialNo || !description) {
    return NextResponse.json({ error: 'ID, materialNo, and description are required.' }, { status: 400 });
  }

  try {
    const exists = await SparePart.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'SparePart ID already exists.' }, { status: 409 });
    }
    const sparePart = await SparePart.create({ id, materialNo, description, proposedStock, currentStock, price, minStock, maxStock, status, equipmentTypeIds });
    return NextResponse.json(sparePart, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 