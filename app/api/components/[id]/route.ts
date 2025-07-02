import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';
import { requireRole } from '@/lib/requireRole';

// GET: Get single component by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const component = await Component.findOne({ id: params.id });
    if (!component) return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    return NextResponse.json(component);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update component by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const component = await Component.findOneAndUpdate({ id: params.id }, data, { new: true });
    if (!component) return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    return NextResponse.json(component);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove component by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const component = await Component.findOneAndDelete({ id: params.id });
    if (!component) return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    return NextResponse.json({ message: 'Component deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 