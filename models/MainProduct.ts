import mongoose, { Schema, model, models } from 'mongoose';

const mainProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  manufacturer: { type: String },
  model: { type: String },
  serialNumber: { type: String },
  installationDate: { type: String },
  notes: { type: String },
});

const MainProductModel = models.MainProduct || model('MainProduct', mainProductSchema);
export default MainProductModel; 