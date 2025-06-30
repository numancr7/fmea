import mongoose, { Schema, model, models } from 'mongoose';
import { System, Component } from '@/types/equipment-types';

const componentSchema = new Schema<Component>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  subcomponents: { type: Array, default: [] },
  remarks: String,
});

const systemSchema = new Schema<System>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  components: { type: [componentSchema], default: [] },
});

const SystemModel = models.System || model<System>('System', systemSchema);
export default SystemModel; 