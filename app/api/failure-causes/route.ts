import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FailureCause from '@/models/FailureCause';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  await connectToDatabase();
  try {
    const failureCauses = await FailureCause.find().sort({ createdAt: -1 });
    return NextResponse.json(failureCauses);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { causeName, causeCode, causeDescription } = await req.json();

  if (!causeName || !causeCode) {
    return NextResponse.json({ error: 'Cause name and cause code are required.' }, { status: 400 });
  }

  try {
    // Check if causeName or causeCode already exists
    const exists = await FailureCause.findOne({ $or: [{ causeName }, { causeCode }] });
    if (exists) {
      return NextResponse.json({ error: 'Failure cause with this name or code already exists.' }, { status: 409 });
    }
    
    const failureCause = await FailureCause.create({ causeName, causeCode, causeDescription });
    
    return NextResponse.json(failureCause, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 