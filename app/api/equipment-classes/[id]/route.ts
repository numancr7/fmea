import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentClass from '@/models/EquipmentClass';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const equipmentClass = await EquipmentClass.findOne({ id: params.id });
    if (!equipmentClass) return NextResponse.json({ error: 'EquipmentClass not found' }, { status: 404 });
    return NextResponse.json(equipmentClass);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description, lastReviewed, reviewerList, classEngineeringDiscipline } = await req.json();
  try {
    const equipmentClass = await EquipmentClass.findOne({ id: params.id });
    if (!equipmentClass) return NextResponse.json({ error: 'EquipmentClass not found' }, { status: 404 });
    if (name) equipmentClass.name = name;
    if (description !== undefined) equipmentClass.description = description;
    if (lastReviewed !== undefined) equipmentClass.lastReviewed = lastReviewed;
    if (reviewerList !== undefined) equipmentClass.reviewerList = reviewerList;
    if (classEngineeringDiscipline !== undefined) equipmentClass.classEngineeringDiscipline = classEngineeringDiscipline;
    await equipmentClass.save();
    return NextResponse.json(equipmentClass);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const equipmentClass = await EquipmentClass.findOneAndDelete({ id: params.id });
    if (!equipmentClass) return NextResponse.json({ error: 'EquipmentClass not found' }, { status: 404 });
    return NextResponse.json({ message: 'EquipmentClass deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 