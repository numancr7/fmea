import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/MainProduct';
import Component from '@/models/Component';
import FailureMode from '@/models/FailureMode';
import SparePart from '@/models/SparePart';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  // Fetch all data in parallel
  const [products, components, failureModes, spareParts] = await Promise.all([
    Product.find(),
    Component.find(),
    FailureMode.find(),
    SparePart.find(),
  ]);

  // Calculate stats
  const totalProducts = products.length;
  const totalComponents = components.length;
  const totalCriticalFailures = failureModes.filter(fm => fm.riskLevel === 'critical' || fm.riskLevel === 'high').length;
  const totalSpareParts = spareParts.length;

  // Failure mode summary
  const failureModesSummary = {
    total: failureModes.length,
    byRiskLevel: failureModes.reduce((acc: any, fm: any) => {
      acc[fm.riskLevel] = (acc[fm.riskLevel] || 0) + 1;
      return acc;
    }, {}),
    byCategory: failureModes.reduce((acc: any, fm: any) => {
      acc[fm.category] = (acc[fm.category] || 0) + 1;
      return acc;
    }, {}),
    highCritical: failureModes.filter((fm: any) => fm.riskLevel === 'critical' || fm.riskLevel === 'high').length,
  };

  // Spare parts status
  const sparePartsStatus = {
    approved: spareParts.filter((sp: any) => sp.status === 'approved').length,
    pending: spareParts.filter((sp: any) => sp.status === 'pending').length,
    rejected: spareParts.filter((sp: any) => sp.status === 'rejected').length,
    lowStock: spareParts.filter((sp: any) => sp.currentStock < sp.minStock),
  };

  // High risk items
  const highRiskItems = failureModes
    .filter((fm: any) => fm.riskLevel === 'critical' || fm.riskLevel === 'high')
    .sort((a: any, b: any) => (b.rpn || 0) - (a.rpn || 0))
    .slice(0, 5);

  // Risk matrix (fetch from API or use static for now)
  const riskMatrix: any[] = [];

  return NextResponse.json({
    totalProducts,
    totalComponents,
    totalCriticalFailures,
    totalSpareParts,
    riskMatrix,
    failureModesSummary,
    sparePartsStatus,
    highRiskItems,
  });
} 