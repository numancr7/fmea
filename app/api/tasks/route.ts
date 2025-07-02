import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Task from '@/models/Task';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, taskList, sapGTL, mainWorkCenter, interval, taskType, taskDescription, numberOfPerson, manHour, equipmentClassId } = await req.json();

  if (!id || !taskType) {
    return NextResponse.json({ error: 'ID and taskType are required.' }, { status: 400 });
  }

  try {
    const exists = await Task.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'Task ID already exists.' }, { status: 409 });
    }
    const task = await Task.create({ id, taskList, sapGTL, mainWorkCenter, interval, taskType, taskDescription, numberOfPerson, manHour, equipmentClassId });
    return NextResponse.json(task, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 