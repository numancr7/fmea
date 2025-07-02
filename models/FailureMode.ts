import mongoose, { Schema, model, models } from 'mongoose';

const failureModeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  additionalDescription: { type: String },
  riskRating: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  rpn: { type: Number, required: true },
  severity: { type: Number, required: true },
  probability: { type: Number, required: true },
  detectability: { type: Number, required: true },
  componentIds: [{ type: String, required: true }],
  causeIds: [{ type: String, required: true }],
  mechanismIds: [{ type: String, required: true }],
});

const FailureModeModel = models.FailureMode || model('FailureMode', failureModeSchema);
export default FailureModeModel; 