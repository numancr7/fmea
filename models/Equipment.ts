import mongoose, { Schema, model, models } from 'mongoose';
import { Equipment, EquipmentFunction, TaskMapping } from '@/types/equipment-types';

const equipmentFunctionSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const taskMappingSchema = new Schema<TaskMapping>({
  taskId: { type: String, required: true },
  isSelected: { type: Boolean, required: true },
});

const equipmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  area: { type: String },
  unit: { type: String },
  numberOfUnits: { type: Number },
  criticality: { type: String },
  sce: { type: String },
  equipmentClass: { type: String },
  equipmentType: { type: String },
  manufacturer: { type: String },
  model: { type: String },
  functionalLocation: { type: String },
  functionalLocationFromSAP: { type: String },
  functionalLocationDescriptionFromSAP: { type: String },
  techIdentNoFromSAP: { type: String },
  equipmentNoFromSAP: { type: String },
  equipmentDescriptionFromSAP: { type: String },
  equipmentDescription: { type: String },
  equipmentFunctions: { type: [equipmentFunctionSchema], default: [] },
  taskListMapping: { type: Array, default: [] },
});

const EquipmentModel = models.Equipment || model('Equipment', equipmentSchema);
export default EquipmentModel; 