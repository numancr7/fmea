import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MainProduct from '@/models/MainProduct';
import { requireRole } from '@/lib/requireRole';

// GET: List all products
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const products = await MainProduct.find();
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create new product
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    const exists = await MainProduct.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Product ID already exists.' }, { status: 409 });
    }
    const product = await MainProduct.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 