import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import MainProduct from '@/models/MainProduct';
import { requireRole } from '@/lib/requireRole';

// GET: List all products
export async function GET() {
  await connectToDatabase();
  try {
    const products = await MainProduct.find();
    return NextResponse.json(products);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// POST: Create new product
export async function POST(req: NextRequest) {
  const roleCheck = await requireRole(req, ['admin']);
  if (roleCheck) return roleCheck;
  await connectToDatabase();
  const data = await req.json();
  try {
    if (!data.id || !data.name) {
      return NextResponse.json({ error: 'id and name are required.' }, { status: 400 });
    }
    const exists = await MainProduct.findOne({ id: data.id });
    if (exists) {
      return NextResponse.json({ error: 'Product ID already exists.' }, { status: 409 });
    }
    const product = await MainProduct.create({
      id: data.id,
      name: data.name,
      description: data.description,
      manufacturer: data.manufacturer,
      model: data.model,
      serialNumber: data.serialNumber,
      installationDate: data.installationDate,
      notes: data.notes,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 