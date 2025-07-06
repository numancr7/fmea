import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Component from '@/models/Component';
import { requireRole } from '@/lib/requireRole';
import { handleApiError } from '@/lib/utils';

// GET: Get single component by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Try to find by custom id field first, then by MongoDB _id
    let component = await Component.findOne({ id }).populate('modules');
    if (!component) {
      // If not found by custom id, try by MongoDB _id
      component = await Component.findById(id).populate('modules');
    }
    
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    return NextResponse.json(component);
  } catch (err) {
    const { status, body } = handleApiError(err, 'Get Component');
    return NextResponse.json(body, { status });
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
    let component = await Component.findOneAndUpdate({ id }, data, { new: true }).populate('modules');
    if (!component) {
      // If not found by custom id, try by MongoDB _id
      component = await Component.findByIdAndUpdate(id, data, { new: true }).populate('modules');
    }
    
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }
    
    return NextResponse.json(component);
  } catch (err) {
    const { status, body } = handleApiError(err, 'Update Component');
    return NextResponse.json(body, { status });
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
  } catch (err) {
    const { status, body } = handleApiError(err, 'Delete Component');
    return NextResponse.json(body, { status });
  }
} 