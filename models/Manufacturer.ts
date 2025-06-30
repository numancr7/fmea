import mongoose, { Schema, model, models } from 'mongoose';
import { Manufacturer } from '@/types/equipment-types';

const manufacturerSchema = new Schema<Manufacturer>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contactInfo: String,
  website: String,
});

const ManufacturerModel = models.Manufacturer || model<Manufacturer>('Manufacturer', manufacturerSchema);
export default ManufacturerModel; 