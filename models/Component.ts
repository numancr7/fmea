import mongoose, { Schema, model, models } from 'mongoose';

const componentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  functions: [{ type: String, required: true }],
  equipmentTypeId: { type: String, required: true },
  riskRating: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: false },
});

const ComponentModel = models.Component || model('Component', componentSchema);
export default ComponentModel; 