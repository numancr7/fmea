import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TaskType from '@/models/TaskType';
import { requireRole } from '@/lib/requireRole';

// GET: Get single task type by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const taskType = await TaskType.findOne({ id });
    if (!taskType) return NextResponse.json({ error: 'Task type not found' }, { status: 404 });
    return NextResponse.json(taskType);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// PATCH: Update task type by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const { id } = await params;
    const taskType = await TaskType.findOneAndUpdate({ id }, data, { new: true });
    if (!taskType) return NextResponse.json({ error: 'Task type not found' }, { status: 404 });
    return NextResponse.json(taskType);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// DELETE: Remove task type by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const taskType = await TaskType.findOneAndDelete({ id });
    if (!taskType) return NextResponse.json({ error: 'Task type not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task type deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 