import mongoose, { Schema, model, models } from 'mongoose';
import { FailureMechanism } from '@/types/equipment-types';

const failureMechanismSchema = new Schema<FailureMechanism>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

const FailureMechanismModel = models.FailureMechanism || model<FailureMechanism>('FailureMechanism', failureMechanismSchema);
export default FailureMechanismModel; 