import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Equipment from '@/models/Equipment';
import FMEA from '@/models/FMEA';
import { requireRole } from '@/lib/requireRole';

// Helper: Calculate RPN for an equipment
async function calculateRPN(equipmentId: string) {
  // Find all FMEA docs for this equipment
  const fmeas = await FMEA.find({ mainEquipment: equipmentId });
  // Assume each FMEA doc has severity, occurrence, detection fields (numbers)
  let totalRPN = 0;
  let count = 0;
  for (const fmea of fmeas) {
    const s = Number(fmea.severity);
    const o = Number(fmea.occurrence);
    const d = Number(fmea.detection);
    if (!isNaN(s) && !isNaN(o) && !isNaN(d)) {
      totalRPN += s * o * d;
      count++;
    }
  }
  return count > 0 ? Math.round(totalRPN / count) : null;
}

// GET: List all equipment
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const url = new URL(req.url);
  const withRpn = url.searchParams.get('rpn') === 'true';
  try {
    const equipments = await Equipment.find();
    if (withRpn) {
      // Attach RPN to each equipment
      const results = await Promise.all(equipments.map(async (eq: unknown) => {
        const rpn = await calculateRPN((eq as any).id);
        return { ...(eq as any).toObject(), rpn };
      }));
      return NextResponse.json(results);
    }
    return NextResponse.json(equipments);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new equipment (all fields from model)
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const exists = await Equipment.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Equipment ID already exists.' }, { status: 409 });
    }
    const equipment = await Equipment.create(data);
    return NextResponse.json(equipment, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 