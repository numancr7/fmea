import mongoose, { Schema, model, models } from 'mongoose';

const failureModeSchema = new Schema({
  name: { type: String, required: true }, // Failure Mode Name (required)
  associatedComponent: { type: String }, // Associated Component (optional)
  severity: { type: String }, // Severity (optional)
  probability: { type: String }, // Probability (optional)
  detection: { type: String }, // Detection (optional)
  rpn: { type: String }, // Risk Priority Number (optional)
  description: { type: String }, // Description (optional)
  failureMechanism: { type: String }, // Failure Mechanism (optional)
  effect: { type: String }, // Effect (optional)
  mitigationTasks: { type: String }, // Mitigation Tasks (optional)
  notes: { type: String }, // Notes (optional)
});

const FailureModeModel = models.FailureMode || model('FailureMode', failureModeSchema);
export default FailureModeModel; 