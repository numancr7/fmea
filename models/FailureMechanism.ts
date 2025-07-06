import mongoose, { Schema, model, models } from 'mongoose';

const failureMechanismSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const FailureMechanismModel = models.FailureMechanism || model('FailureMechanism', failureMechanismSchema);
export default FailureMechanismModel; 