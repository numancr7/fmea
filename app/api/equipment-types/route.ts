import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentType from '@/models/EquipmentType';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const equipmentTypes = await EquipmentType.find().populate('equipmentClassId', 'name').lean();
    return NextResponse.json(equipmentTypes);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description, equipmentClassId, systems } = await req.json();

  if (!name || !equipmentClassId) {
    return NextResponse.json({ error: 'Name and equipmentClassId are required.' }, { status: 400 });
  }

  try {
    const equipmentType = await EquipmentType.create({ name, description, equipmentClassId, systems });
    return NextResponse.json(equipmentType, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 