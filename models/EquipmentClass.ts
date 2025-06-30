import mongoose, { Schema, model, models } from 'mongoose';
import { EquipmentClass } from '@/types/equipment-types';

const equipmentClassSchema = new Schema<EquipmentClass>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  lastReviewed: String,
  reviewerList: String,
  classEngineeringDiscipline: String,
});

const EquipmentClassModel = models.EquipmentClass || model<EquipmentClass>('EquipmentClass', equipmentClassSchema);
export default EquipmentClassModel; 