import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';
import { requireRole } from '@/lib/requireRole';

// GET: Get single component by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Try to find by custom id field first, then by MongoDB _id
    let component = await Component.findOne({ id });
    if (!component) {
      // If not found by custom id, try by MongoDB _id
      component = await Component.findById(id);
    }
    
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    return NextResponse.json(component);
  } catch (err: unknown) {
    console.error('Error fetching component:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update component by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleCheck = await requireRole(req, ['admin']);
    if (roleCheck) return roleCheck;
    
    await connectToDatabase();
    const data = await req.json();
    const { id } = await params;
    
    // Try to find by custom id field first, then by MongoDB _id
    let component = await Component.findOneAndUpdate({ id }, data, { new: true });
    if (!component) {
      // If not found by custom id, try by MongoDB _id
      component = await Component.findByIdAndUpdate(id, data, { new: true });
    }
    
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    return NextResponse.json(component);
  } catch (err: unknown) {
    console.error('Error updating component:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove component by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const roleCheck = await requireRole(req, ['admin']);
    if (roleCheck) return roleCheck;
    
    await connectToDatabase();
    const { id } = await params;
    
    // Try to find by custom id field first, then by MongoDB _id
    let component = await Component.findOneAndDelete({ id });
    if (!component) {
      // If not found by custom id, try by MongoDB _id
      component = await Component.findByIdAndDelete(id);
    }
    
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Component deleted' });
  } catch (err: unknown) {
    console.error('Error deleting component:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 