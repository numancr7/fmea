import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TaskType from '@/models/TaskType';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const taskType = await TaskType.findOne({ id: params.id });
    if (!taskType) return NextResponse.json({ error: 'TaskType not found' }, { status: 404 });
    return NextResponse.json(taskType);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name } = await req.json();
  try {
    const taskType = await TaskType.findOneAndUpdate({ id: params.id }, { name }, { new: true });
    if (!taskType) return NextResponse.json({ error: 'TaskType not found' }, { status: 404 });
    return NextResponse.json(taskType);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const taskType = await TaskType.findOneAndDelete({ id: params.id });
    if (!taskType) return NextResponse.json({ error: 'TaskType not found' }, { status: 404 });
    return NextResponse.json({ message: 'TaskType deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 