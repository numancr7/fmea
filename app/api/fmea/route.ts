import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FMEA from '@/models/FMEA';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const fmeas = await FMEA.find();
    return NextResponse.json(fmeas);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();

  if (!data.id || !data.fmeaNumber || !data.mainEquipment) {
    return NextResponse.json({ error: 'ID, fmeaNumber, and mainEquipment are required.' }, { status: 400 });
  }

  try {
    const exists = await FMEA.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'FMEA ID already exists.' }, { status: 409 });
    }
    const fmea = await FMEA.create(data);
    return NextResponse.json(fmea, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 