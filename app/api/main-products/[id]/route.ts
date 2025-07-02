import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MainProduct from '@/models/MainProduct';
import { requireRole } from '@/lib/requireRole';

// GET: Get single product by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const product = await MainProduct.findOne({ id: params.id });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update product by id (all fields)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const product = await MainProduct.findOneAndUpdate({ id: params.id }, data, { new: true });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove product by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  try {
    const product = await MainProduct.findOneAndDelete({ id: params.id });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 