import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureCause from '@/models/FailureCause';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const failureCauses = await FailureCause.find();
    return NextResponse.json(failureCauses);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { id, causeName, causeCode, causeDescription } = await req.json();

  if (!id || !causeName || !causeCode) {
    return NextResponse.json({ error: 'ID, causeName, and causeCode are required.' }, { status: 400 });
  }

  try {
    const exists = await FailureCause.findOne({ id });
    if (exists) {
      return NextResponse.json({ error: 'FailureCause ID already exists.' }, { status: 409 });
    }
    const failureCause = await FailureCause.create({ id, causeName, causeCode, causeDescription });
    return NextResponse.json(failureCause, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 