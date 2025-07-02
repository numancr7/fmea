import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMode from '@/models/FailureMode';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const failureMode = await FailureMode.findOne({ id: params.id });
    if (!failureMode) return NextResponse.json({ error: 'FailureMode not found' }, { status: 404 });
    return NextResponse.json(failureMode);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { category, subCategory, description } = await req.json();
  try {
    const failureMode = await FailureMode.findOneAndUpdate({ id: params.id }, { category, subCategory, description }, { new: true });
    if (!failureMode) return NextResponse.json({ error: 'FailureMode not found' }, { status: 404 });
    return NextResponse.json(failureMode);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const failureMode = await FailureMode.findOneAndDelete({ id: params.id });
    if (!failureMode) return NextResponse.json({ error: 'FailureMode not found' }, { status: 404 });
    return NextResponse.json({ message: 'FailureMode deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 