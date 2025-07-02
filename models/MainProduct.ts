import mongoose, { Schema, model, models } from 'mongoose';

const mainProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  equipmentTypeId: { type: String, required: true },
  componentIds: [{ type: String, required: true }],
  failureModeIds: [{ type: String, required: true }],
  probability: { type: Number, required: true },
  riskRating: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
});

const MainProductModel = models.MainProduct || model('MainProduct', mainProductSchema);
export default MainProductModel; 