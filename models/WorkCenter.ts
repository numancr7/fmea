import mongoose, { Schema, model, models } from 'mongoose';
import { WorkCenter } from '@/types/models';

const workCenterSchema = new Schema<WorkCenter>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
});

const WorkCenterModel = models.WorkCenter || model<WorkCenter>('WorkCenter', workCenterSchema);
export default WorkCenterModel; 