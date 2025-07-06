import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import EquipmentFunction from '@/models/EquipmentFunction';

export async function GET() {
  await connectToDatabase();
  try {
    const equipmentFunctions = await EquipmentFunction.find();
    return NextResponse.json(equipmentFunctions);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 