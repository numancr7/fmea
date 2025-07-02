import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RiskMatrixCell from '@/models/RiskMatrixCell';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const cell = await RiskMatrixCell.findOne({ id: params.id });
    if (!cell) return NextResponse.json({ error: 'RiskMatrixCell not found' }, { status: 404 });
    return NextResponse.json(cell);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { severity, likelihood, color, label } = await req.json();
  try {
    const cell = await RiskMatrixCell.findOneAndUpdate({ id: params.id }, { severity, likelihood, color, label }, { new: true });
    if (!cell) return NextResponse.json({ error: 'RiskMatrixCell not found' }, { status: 404 });
    return NextResponse.json(cell);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const cell = await RiskMatrixCell.findOneAndDelete({ id: params.id });
    if (!cell) return NextResponse.json({ error: 'RiskMatrixCell not found' }, { status: 404 });
    return NextResponse.json({ message: 'RiskMatrixCell deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 