import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const sparePartSchema = new Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  equipmentId: { type: String, required: true },
  materialNumber: { type: String, required: true },
  materialDescription: { type: String, required: true },
  proposeStock: { type: Number, required: true },
  minimum: { type: Number, required: true },
  maximum: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  stockStatus: { type: String, required: true },
  remarks: { type: String, default: '' },
}, {
  timestamps: true,
});

sparePartSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  if (!this.id) {
    this.id = uuidv4();
  }
  next();
});

const SparePartModel = models.SparePart || model('SparePart', sparePartSchema);
export default SparePartModel; 