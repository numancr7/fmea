import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMode from '@/models/FailureMode';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const failureModes = await FailureMode.find();
    return NextResponse.json(failureModes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, category, subCategory, description } = await req.json();

  if (!id || !category || !description) {
    return NextResponse.json({ error: 'ID, category, and description are required.' }, { status: 400 });
  }

  try {
    const exists = await FailureMode.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'FailureMode ID already exists.' }, { status: 409 });
    }
    const failureMode = await FailureMode.create({ id, category, subCategory, description });
    return NextResponse.json(failureMode, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 