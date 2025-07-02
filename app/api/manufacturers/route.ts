import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Manufacturer from '@/models/Manufacturer';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const manufacturers = await Manufacturer.find();
    return NextResponse.json(manufacturers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, name, contactInfo, website } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'ID and name are required.' }, { status: 400 });
  }

  try {
    const exists = await Manufacturer.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'Manufacturer ID already exists.' }, { status: 409 });
    }
    const manufacturer = await Manufacturer.create({ id, name, contactInfo, website });
    return NextResponse.json(manufacturer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 