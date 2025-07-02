import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MainProduct from '@/models/MainProduct';
import { requireRole } from '@/lib/requireRole';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const mainProduct = await MainProduct.findOne({ id: params.id });
    if (!mainProduct) return NextResponse.json({ error: 'MainProduct not found' }, { status: 404 });
    return NextResponse.json(mainProduct);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const { name, description } = await req.json();
  try {
    const mainProduct = await MainProduct.findOneAndUpdate({ id: params.id }, { name, description }, { new: true });
    if (!mainProduct) return NextResponse.json({ error: 'MainProduct not found' }, { status: 404 });
    return NextResponse.json(mainProduct);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const mainProduct = await MainProduct.findOneAndDelete({ id: params.id });
    if (!mainProduct) return NextResponse.json({ error: 'MainProduct not found' }, { status: 404 });
    return NextResponse.json({ message: 'MainProduct deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 