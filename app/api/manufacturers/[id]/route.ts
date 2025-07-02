import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Manufacturer from '@/models/Manufacturer';
import { requireRole } from '@/lib/requireRole';

// GET: Get single manufacturer by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const manufacturer = await Manufacturer.findOne({ id: params.id });
    if (!manufacturer) return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    return NextResponse.json(manufacturer);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update manufacturer by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const manufacturer = await Manufacturer.findOneAndUpdate({ id: params.id }, data, { new: true });
    if (!manufacturer) return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    return NextResponse.json(manufacturer);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove manufacturer by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const manufacturer = await Manufacturer.findOneAndDelete({ id: params.id });
    if (!manufacturer) return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    return NextResponse.json({ message: 'Manufacturer deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 