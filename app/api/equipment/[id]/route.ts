import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Equipment from '@/models/Equipment';
import FMEA from '@/models/FMEA';
import { requireRole } from '@/lib/requireRole';

// Helper: Calculate RPN for an equipment
async function calculateRPN(equipmentId: string) {
  const fmeas = await FMEA.find({ mainEquipment: equipmentId });
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

// GET: Get single equipment by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const url = new URL(req.url);
  const withRpn = url.searchParams.get('rpn') === 'true';
  try {
    const { id } = await params;
    const equipment = await Equipment.findOne({ id });
    if (!equipment) return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    if (withRpn) {
      const rpn = await calculateRPN(id);
      return NextResponse.json({ ...equipment.toObject(), rpn });
    }
    return NextResponse.json(equipment);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update equipment by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const equipment = await Equipment.findOneAndUpdate({ id }, data, { new: true });
    if (!equipment) return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    return NextResponse.json(equipment);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove equipment by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const equipment = await Equipment.findOneAndDelete({ id });
    if (!equipment) return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
    return NextResponse.json({ message: 'Equipment deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 