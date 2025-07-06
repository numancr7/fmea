import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FMEA from '@/models/FMEA';
import { requireRole } from '@/lib/requireRole';
import { nanoid } from 'nanoid';

// GET: List all FMEA analyses
export async function GET() {
  await connectToDatabase();
  try {
    const fmeas = await FMEA.find();
    return NextResponse.json(fmeas);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new FMEA analysis
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();

  if (!data.fmeaNumber || !data.mainEquipment) {
    return NextResponse.json({ error: 'fmeaNumber and mainEquipment are required.' }, { status: 400 });
  }

  try {
    // Always generate a unique id if not provided
    if (!data.id) {
      data.id = nanoid();
    }
    
    const exists = await FMEA.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'FMEA ID already exists.' }, { status: 409 });
    }
    const fmea = await FMEA.create(data);
    return NextResponse.json(fmea, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 