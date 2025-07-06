import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';
import { requireRole } from '@/lib/requireRole';
import { v4 as uuidv4 } from 'uuid';

// GET: List all components
export async function GET() {
  await connectToDatabase();
  try {
    const components = await Component.find();
    return NextResponse.json(components);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new component
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    // Generate a unique ID if not provided
    const componentData = {
      ...data,
      id: data.id || `comp-${uuidv4()}`
    };
    
    const exists = await Component.findOne({ id: componentData.id });
    if (exists) {
      return NextResponse.json({ error: 'Component ID already exists.' }, { status: 409 });
    }
    
    const component = await Component.create(componentData);
    return NextResponse.json(component, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 