import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentFunction from '@/models/EquipmentFunction';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const equipmentFunctions = await EquipmentFunction.find();
    return NextResponse.json(equipmentFunctions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 