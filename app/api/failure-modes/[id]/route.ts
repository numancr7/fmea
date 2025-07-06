import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMode from '@/models/FailureMode';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const failureMode = await FailureMode.findById(id);
    if (!failureMode) return NextResponse.json({ error: 'FailureMode not found' }, { status: 404 });
    return NextResponse.json(failureMode);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const body = await req.json();
  const {
    name,
    associatedComponent,
    severity,
    probability,
    detection,
    rpn,
    description,
    failureMechanism,
    effect,
    mitigationTasks,
    notes
  } = body;
  if (!name) {
    return NextResponse.json({ error: 'Failure Mode Name is required.' }, { status: 400 });
  }
  try {
    const { id } = await params;
    const failureMode = await FailureMode.findByIdAndUpdate(
      id,
      {
        name,
        associatedComponent,
        severity,
        probability,
        detection,
        rpn,
        description,
        failureMechanism,
        effect,
        mitigationTasks,
        notes
      },
      { new: true }
    );
    if (!failureMode) return NextResponse.json({ error: 'FailureMode not found' }, { status: 404 });
    return NextResponse.json(failureMode);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const { id } = await params;
    const failureMode = await FailureMode.findByIdAndDelete(id);
    if (!failureMode) return NextResponse.json({ error: 'FailureMode not found' }, { status: 404 });
    return NextResponse.json({ message: 'FailureMode deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 