import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentClass from '@/models/EquipmentClass';
import { requireRole } from '@/lib/requireRole';

// GET: Get single equipment class by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const equipmentClass = await EquipmentClass.findOne({ id });
    if (!equipmentClass) return NextResponse.json({ error: 'Equipment class not found' }, { status: 404 });
    return NextResponse.json(equipmentClass);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update equipment class by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const equipmentClass = await EquipmentClass.findOneAndUpdate({ id }, data, { new: true });
    if (!equipmentClass) return NextResponse.json({ error: 'Equipment class not found' }, { status: 404 });
    return NextResponse.json(equipmentClass);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove equipment class by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const equipmentClass = await EquipmentClass.findOneAndDelete({ id });
    if (!equipmentClass) return NextResponse.json({ error: 'Equipment class not found' }, { status: 404 });
    return NextResponse.json({ message: 'Equipment class deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 