import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const components = await Component.find();
    return NextResponse.json(components);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, name, subcomponents, remarks } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'ID and name are required.' }, { status: 400 });
  }

  try {
    const exists = await Component.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'Component ID already exists.' }, { status: 409 });
    }
    const component = await Component.create({ id, name, subcomponents, remarks });
    return NextResponse.json(component, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 