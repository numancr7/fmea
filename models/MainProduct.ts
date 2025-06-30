import mongoose, { Schema, model, models } from 'mongoose';
import { MainProduct } from '@/types/fmea-types';

const mainProductSchema = new Schema<MainProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  equipmentTypeId: { type: String, required: true },
  componentIds: [{ type: String }],
  failureModeIds: [{ type: String }],
  probability: { type: Number, required: true },
  riskRating: { type: String, required: true },
});

const MainProductModel = models.MainProduct || model<MainProduct>('MainProduct', mainProductSchema);
export default MainProductModel; 