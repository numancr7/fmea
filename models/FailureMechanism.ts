import mongoose, { Schema, model, models } from 'mongoose';

const failureMechanismSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Mechanical', 'Electrical', 'Safety & Control', 'Rotating', 'General'], required: true },
  description: { type: String, required: true },
});

const FailureMechanismModel = models.FailureMechanism || model('FailureMechanism', failureMechanismSchema);
export default FailureMechanismModel; 