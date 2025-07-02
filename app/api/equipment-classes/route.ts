import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentClass from '@/models/EquipmentClass';
import { requireRole } from '@/lib/requireRole';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const equipmentClasses = await EquipmentClass.find();
    return NextResponse.json(equipmentClasses);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description, lastReviewed, reviewerList, classEngineeringDiscipline } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  try {
    const exists = await EquipmentClass.findOne({ name });
    if (exists) {
      return NextResponse.json({ error: 'Equipment class name already exists.' }, { status: 409 });
    }
    const id = uuidv4();
    const equipmentClass = await EquipmentClass.create({ id, name, description, lastReviewed, reviewerList, classEngineeringDiscipline });
    return NextResponse.json(equipmentClass, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 