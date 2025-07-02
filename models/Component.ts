import mongoose, { Schema, model, models } from 'mongoose';
import { Component, Subcomponent } from '@/types/equipment-types';
import { subcomponentSchema } from './Subcomponent';

export const componentSchema = new Schema<Component>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  remarks: { type: String },
  subcomponents: { type: [subcomponentSchema], default: [] },
});

const ComponentModel = models.Component || model<Component>('Component', componentSchema);
export default ComponentModel; 