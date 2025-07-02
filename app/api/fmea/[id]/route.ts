import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FMEA from '@/models/FMEA';
import { requireRole } from '@/lib/requireRole';

// GET: Get single FMEA by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const fmea = await FMEA.findOne({ id: params.id });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json(fmea);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update FMEA by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const fmea = await FMEA.findOneAndUpdate({ id: params.id }, data, { new: true });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json(fmea);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove FMEA by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const fmea = await FMEA.findOneAndDelete({ id: params.id });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json({ message: 'FMEA deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 