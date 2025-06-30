import mongoose, { Schema, model, models } from 'mongoose';
import { RiskMatrixCell } from '@/types/models';

const riskMatrixCellSchema = new Schema<RiskMatrixCell>({
  severity: { type: Number, required: true },
  probability: { type: Number, required: true },
  level: { type: String, required: true },
  count: { type: Number, required: true },
});

const RiskMatrixCellModel = models.RiskMatrixCell || model<RiskMatrixCell>('RiskMatrixCell', riskMatrixCellSchema);
export default RiskMatrixCellModel; 