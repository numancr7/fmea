import mongoose, { Schema, model, models } from 'mongoose';
import { Equipment, EquipmentFunction, TaskMapping } from '@/types/equipment-types';

const equipmentFunctionSchema = new Schema<EquipmentFunction>({
  id: { type: String, required: true },
  description: { type: String, required: true },
});

const taskMappingSchema = new Schema<TaskMapping>({
  taskId: { type: String, required: true },
  isSelected: { type: Boolean, required: true },
});

const equipmentSchema = new Schema<Equipment>({
  id: { type: String, required: true, unique: true },
  area: String,
  unit: String,
  functionalLocation: String,
  functionalLocationFromSAP: String,
  functionalLocationDescriptionFromSAP: String,
  techIdentNoFromSAP: String,
  equipmentNoFromSAP: String,
  equipmentDescriptionFromSAP: String,
  sce: String,
  equipmentDescription: String,
  equipmentType: String,
  manufacturer: String,
  model: String,
  criticality: String,
  equipmentClass: String,
  equipmentFunctions: { type: [equipmentFunctionSchema], default: [] },
  numberOfUnits: Number,
  taskListMapping: { type: [taskMappingSchema], default: [] },
});

const EquipmentModel = models.Equipment || model<Equipment>('Equipment', equipmentSchema);
export default EquipmentModel; 