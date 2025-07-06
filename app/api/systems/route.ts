import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import System from '@/models/System';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const systems = await System.find();
    return NextResponse.json(systems);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, name, components } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'ID and name are required.' }, { status: 400 });
  }

  try {
    const exists = await System.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'System ID already exists.' }, { status: 409 });
    }
    const system = await System.create({ id, name, components });
    return NextResponse.json(system, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 