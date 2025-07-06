import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentType from '@/models/EquipmentType';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const equipmentType = await EquipmentType.findById(id).populate('equipmentClassId', 'name').lean();
    if (!equipmentType) return NextResponse.json({ error: 'EquipmentType not found' }, { status: 404 });
    return NextResponse.json(equipmentType);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description, equipmentClassId, systems } = await req.json();
  try {
    const { id } = await params;
    const equipmentType = await EquipmentType.findById(id);
    if (!equipmentType) return NextResponse.json({ error: 'EquipmentType not found' }, { status: 404 });

    if (name) equipmentType.name = name;
    if (description !== undefined) equipmentType.description = description;
    if (equipmentClassId) equipmentType.equipmentClassId = equipmentClassId;
    if (systems) equipmentType.systems = systems;

    await equipmentType.save();
    return NextResponse.json(equipmentType);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description, equipmentClassId, systems } = await req.json();
  try {
    const { id } = await params;
    const equipmentType = await EquipmentType.findById(id);
    if (!equipmentType) return NextResponse.json({ error: 'EquipmentType not found' }, { status: 404 });

    if (name) equipmentType.name = name;
    if (description !== undefined) equipmentType.description = description;
    if (equipmentClassId) equipmentType.equipmentClassId = equipmentClassId;
    if (systems) equipmentType.systems = systems;

    await equipmentType.save();
    return NextResponse.json(equipmentType);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const equipmentType = await EquipmentType.findByIdAndDelete(id);
    if (!equipmentType) return NextResponse.json({ error: 'EquipmentType not found' }, { status: 404 });
    return NextResponse.json({ message: 'EquipmentType deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 