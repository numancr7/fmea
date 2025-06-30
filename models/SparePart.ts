import mongoose, { Schema, model, models } from 'mongoose';
import { SparePart } from '@/types/fmea-types';

const sparePartSchema = new Schema<SparePart>({
  id: { type: String, required: true, unique: true },
  materialNo: { type: String, required: true },
  description: { type: String, required: true },
  proposedStock: { type: Number, required: true },
  currentStock: { type: Number, required: true },
  price: { type: Number, required: true },
  minStock: { type: Number, required: true },
  maxStock: { type: Number, required: true },
  status: { type: String, enum: ['approved', 'rejected', 'pending'], required: true },
  equipmentTypeIds: [{ type: String }],
});

const SparePartModel = models.SparePart || model<SparePart>('SparePart', sparePartSchema);
export default SparePartModel; 