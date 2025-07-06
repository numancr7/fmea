import mongoose, { Schema, model, models, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IComponent extends Document {
  id: string;
  name: string;
  category?: string;
  functions?: string[];
  equipmentTypeId?: string;
  riskRating?: string;
  modules: string[];
}

export const componentSchema = new Schema<IComponent>({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `comp-${uuidv4()}`
  },
  name: { type: String, required: true },
  category: { type: String, required: false },
  functions: [{ type: String, required: false }],
  equipmentTypeId: { type: String, required: false },
  riskRating: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: false },
  modules: { type: [String], default: [] },
});

const ComponentModel = models.Component || model<IComponent>('Component', componentSchema);
export default ComponentModel; 