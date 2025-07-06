import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TaskType from '@/models/TaskType';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const taskTypes = await TaskType.find();
    return NextResponse.json(taskTypes);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, name } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'ID and name are required.' }, { status: 400 });
  }

  try {
    const exists = await TaskType.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'TaskType ID already exists.' }, { status: 409 });
    }
    const taskType = await TaskType.create({ id, name });
    return NextResponse.json(taskType, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 