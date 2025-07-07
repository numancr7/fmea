/**
 * normalizeDashboardData.ts
 *
 * Script to normalize dashboard-related MongoDB data for Next.js FMEA app.
 * - Ensures all required fields exist and values are normalized for dashboard queries.
 * - Usage: npx tsx scripts/normalizeDashboardData.ts
 */
import { connectToDatabase } from '../lib/db';
import MainProduct from '../models/MainProduct';
import Component from '../models/Component';
import SparePart from '../models/SparePart';
import FailureMode from '../models/FailureMode';

async function normalize() {
  await connectToDatabase();
  let updated = 0;

  // Normalize FailureMode severity
  const failureModes = await FailureMode.find({});
  for (const fm of failureModes) {
    if (fm.severity && typeof fm.severity === 'string') {
      const norm = fm.severity.toLowerCase();
      if (fm.severity !== norm) {
        fm.severity = norm;
        await fm.save();
        updated++;
      }
    }
  }
  console.log(`Normalized severity for ${updated} FailureMode documents.`);

  // Normalize SparePart stockStatus
  updated = 0;
  const spareParts = await SparePart.find({});
  for (const sp of spareParts) {
    if (sp.stockStatus && typeof sp.stockStatus === 'string') {
      const norm = sp.stockStatus.toLowerCase();
      if (sp.stockStatus !== norm) {
        sp.stockStatus = norm;
        await sp.save();
        updated++;
      }
    }
  }
  console.log(`Normalized stockStatus for ${updated} SparePart documents.`);

  // Ensure id field exists for MainProduct
  updated = 0;
  const mainProducts = await MainProduct.find({});
  for (const mp of mainProducts) {
    if (!mp.id && mp._id) {
      mp.id = String(mp._id);
      await mp.save();
      updated++;
    }
  }
  console.log(`Added id field for ${updated} MainProduct documents.`);

  // Ensure id field exists for Component
  updated = 0;
  const components = await Component.find({});
  for (const c of components) {
    if (!c.id && c._id) {
      c.id = String(c._id);
      await c.save();
      updated++;
    }
  }
  console.log(`Added id field for ${updated} Component documents.`);

  console.log('Normalization complete.');
  process.exit(0);
}

normalize().catch((err) => {
  console.error('Error during normalization:', err);
  process.exit(1);
}); 