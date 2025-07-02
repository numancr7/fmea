import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import System from '@/models/System';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const system = await System.findOne({ id: params.id });
    if (!system) return NextResponse.json({ error: 'System not found' }, { status: 404 });
    return NextResponse.json(system);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, components } = await req.json();
  try {
    const system = await System.findOneAndUpdate({ id: params.id }, { name, components }, { new: true });
    if (!system) return NextResponse.json({ error: 'System not found' }, { status: 404 });
    return NextResponse.json(system);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const system = await System.findOneAndDelete({ id: params.id });
    if (!system) return NextResponse.json({ error: 'System not found' }, { status: 404 });
    return NextResponse.json({ message: 'System deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 