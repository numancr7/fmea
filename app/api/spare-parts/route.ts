import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SparePart from '@/models/SparePart';
import { requireRole } from '@/lib/requireRole';

// GET: List all spare parts
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const spareParts = await SparePart.find();
    return NextResponse.json(spareParts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create new spare part
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const exists = await SparePart.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Spare Part ID already exists.' }, { status: 409 });
    }
    const sparePart = await SparePart.create(data);
    return NextResponse.json(sparePart, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 