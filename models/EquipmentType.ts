import mongoose, { Schema, model, models } from 'mongoose';
import { EquipmentType } from '@/types/equipment-types';

const equipmentTypeSchema = new Schema<EquipmentType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  equipmentClassId: { type: String, required: true },
  systems: { type: Array, default: [] },
});

const EquipmentTypeModel = models.EquipmentType || model<EquipmentType>('EquipmentType', equipmentTypeSchema);
export default EquipmentTypeModel; 