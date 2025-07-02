import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';
import { requireRole } from '@/lib/requireRole';

// GET: List all components
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const components = await Component.find();
    return NextResponse.json(components);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create new component
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const exists = await Component.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Component ID already exists.' }, { status: 409 });
    }
    const component = await Component.create(data);
    return NextResponse.json(component, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 