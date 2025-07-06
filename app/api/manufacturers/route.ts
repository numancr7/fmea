import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Manufacturer from '@/models/Manufacturer';
import { requireRole } from '@/lib/requireRole';
import { nanoid } from 'nanoid';

// GET: List all manufacturers
export async function GET() {
  await connectToDatabase();
  try {
    const manufacturers = await Manufacturer.find();
    return NextResponse.json(manufacturers);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new manufacturer
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    // Always generate a unique id if not provided
    if (!data.id) {
      data.id = nanoid();
    }
    const exists = await Manufacturer.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Manufacturer ID already exists.' }, { status: 409 });
    }
    const manufacturer = await Manufacturer.create(data);
    return NextResponse.json(manufacturer, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 