import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RiskMatrixCell from '@/models/RiskMatrixCell';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  try {
    const { id } = await params;
    const cell = await RiskMatrixCell.findOne({ id });
    if (!cell) return NextResponse.json({ error: 'RiskMatrixCell not found' }, { status: 404 });
    return NextResponse.json(cell);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { severity, likelihood, color, label } = await req.json();
  try {
    const { id } = await params;
    const cell = await RiskMatrixCell.findOneAndUpdate({ id }, { severity, likelihood, color, label }, { new: true });
    if (!cell) return NextResponse.json({ error: 'RiskMatrixCell not found' }, { status: 404 });
    return NextResponse.json(cell);
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
    const cell = await RiskMatrixCell.findOneAndDelete({ id });
    if (!cell) return NextResponse.json({ error: 'RiskMatrixCell not found' }, { status: 404 });
    return NextResponse.json({ message: 'RiskMatrixCell deleted' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 