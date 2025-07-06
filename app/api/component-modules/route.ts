import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ComponentModule from '@/models/ComponentModule';

export async function GET() {
  try {
    await connectToDatabase();
    const modules = await ComponentModule.find({}).sort({ name: 1 });
    return NextResponse.json(modules);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name } = await req.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Module name is required' }, { status: 400 });
    }

    const existingModule = await ComponentModule.findOne({ name: name.trim() });
    if (existingModule) {
      return NextResponse.json({ error: 'Module with this name already exists' }, { status: 409 });
    }

    const newModule = new ComponentModule({ name: name.trim() });
    await newModule.save();
    
    return NextResponse.json(newModule, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 