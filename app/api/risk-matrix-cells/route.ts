import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import RiskMatrixCell from '@/models/RiskMatrixCell';
import { requireRole } from '@/lib/requireRole';

// GET: Get all risk matrix cells
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    // Sort by severity (A-E) and probability (1-5)
    const cells = await RiskMatrixCell.find({}).sort({ severity: 1, probability: 1 });
    return NextResponse.json(cells);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new risk matrix cell
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { severity, probability, label, color, riskLevel } = await req.json();
  if (!severity || !probability || !label || !color || !riskLevel) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }
  try {
    const cell = new RiskMatrixCell({ severity, probability, label, color, riskLevel });
    await cell.save();
    return NextResponse.json(cell, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 