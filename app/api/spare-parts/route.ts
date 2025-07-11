import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SparePart from '@/models/SparePart';
import { requireRole } from '@/lib/requireRole';
import { v4 as uuidv4 } from 'uuid';

// GET: List all spare parts
export async function GET() {
  await connectToDatabase();
  try {
    const spareParts = await SparePart.find();
    return NextResponse.json(spareParts);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new spare part
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  // Generate id if not provided
  if (!data.id) data.id = uuidv4();
  try {
    const exists = await SparePart.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Spare Part ID already exists.' }, { status: 409 });
    }
    const sparePart = await SparePart.create(data);
    return NextResponse.json(sparePart, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 