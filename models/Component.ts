import mongoose, { Schema, model, models } from 'mongoose';
import { Component, Subcomponent } from '@/types/equipment-types';

const subcomponentSchema = new Schema<Subcomponent>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  remarks: String,
});

const componentSchema = new Schema<Component>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subcomponents: { type: [subcomponentSchema], default: [] },
  remarks: String,
});

const ComponentModel = models.Component || model<Component>('Component', componentSchema);
export default ComponentModel; 