import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Task from '@/models/Task';
import { requireRole } from '@/lib/requireRole';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  await connectToDatabase();
  try {
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, taskList, sapGTL, mainWorkCenter, interval, taskType, taskDescription, numberOfPerson, manHour, equipmentClassId } = await req.json();

  // Auto-generate id if not provided
  const taskId = id || uuidv4();

  if (!taskType) {
    return NextResponse.json({ error: 'taskType is required.' }, { status: 400 });
  }

  try {
    const exists = await Task.findOne({ id: taskId });
    if (exists) {
      return NextResponse.json({ error: 'Task ID already exists.' }, { status: 409 });
    }
    const task = await Task.create({ id: taskId, taskList, sapGTL, mainWorkCenter, interval, taskType, taskDescription, numberOfPerson, manHour, equipmentClassId });
    return NextResponse.json(task, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 