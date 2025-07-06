import mongoose, { Schema, model, models } from 'mongoose';

export interface ComponentModule {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const componentModuleSchema = new Schema<ComponentModule>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
}, {
  timestamps: true
});

const ComponentModuleModel = models.ComponentModule || model<ComponentModule>('ComponentModule', componentModuleSchema);
export default ComponentModuleModel; 