import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FMEA from '@/models/FMEA';
import { requireRole } from '@/lib/requireRole';

// GET: Get single FMEA by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const fmea = await FMEA.findOne({ id });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json(fmea);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PUT: Update FMEA by id (all fields)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const fmea = await FMEA.findOneAndUpdate({ id }, data, { new: true });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json(fmea);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update FMEA by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const fmea = await FMEA.findOneAndUpdate({ id }, data, { new: true });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json(fmea);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove FMEA by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const fmea = await FMEA.findOneAndDelete({ id });
    if (!fmea) return NextResponse.json({ error: 'FMEA not found' }, { status: 404 });
    return NextResponse.json({ message: 'FMEA deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 