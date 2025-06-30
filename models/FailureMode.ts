import mongoose, { Schema, model, models } from 'mongoose';
import { FailureMode } from '@/types/equipment-types';

const failureModeSchema = new Schema<FailureMode>({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  subCategory: String,
  description: { type: String, required: true },
});

const FailureModeModel = models.FailureMode || model<FailureMode>('FailureMode', failureModeSchema);
export default FailureModeModel; 