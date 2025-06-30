import mongoose, { Schema, model, models } from 'mongoose';
import { EquipmentFunction } from '@/types/equipment-types';

const equipmentFunctionSchema = new Schema<EquipmentFunction>({
  id: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const EquipmentFunctionModel = models.EquipmentFunction || model<EquipmentFunction>('EquipmentFunction', equipmentFunctionSchema);
export default EquipmentFunctionModel; 