import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureMode from '@/models/FailureMode';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const failureModes = await FailureMode.find();
    return NextResponse.json(failureModes);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    const failureMode = await FailureMode.create({
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
    });
    return NextResponse.json(failureMode, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 