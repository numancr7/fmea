import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Manufacturer from '@/models/Manufacturer';
import { requireRole } from '@/lib/requireRole';

// GET: List all manufacturers
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const manufacturers = await Manufacturer.find();
    return NextResponse.json(manufacturers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create new manufacturer
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const exists = await Manufacturer.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Manufacturer ID already exists.' }, { status: 409 });
    }
    const manufacturer = await Manufacturer.create(data);
    return NextResponse.json(manufacturer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 