import mongoose, { Schema, model, models } from 'mongoose';

const riskMatrixCellSchema = new Schema({
  severity: { type: String, required: true }, // A-E
  probability: { type: String, required: true }, // 1-5
  label: { type: String, required: true }, // e.g., 'A1', 'B2', ...
  color: { type: String, required: true }, // e.g., 'bg-green-700', 'bg-yellow-400', ...
  riskLevel: { type: String, required: true }, // e.g., 'low', 'medium', 'high', 'critical'
});

const RiskMatrixCellModel = models.RiskMatrixCell || model('RiskMatrixCell', riskMatrixCellSchema);
export default RiskMatrixCellModel; 