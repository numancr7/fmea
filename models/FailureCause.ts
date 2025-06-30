import mongoose, { Schema, model, models } from 'mongoose';
import { FailureCause } from '@/types/equipment-types';

const failureCauseSchema = new Schema<FailureCause>({
  id: { type: String, required: true, unique: true },
  causeName: { type: String, required: true },
  causeCode: { type: String, required: true },
  causeDescription: String,
});

const FailureCauseModel = models.FailureCause || model<FailureCause>('FailureCause', failureCauseSchema);
export default FailureCauseModel; 