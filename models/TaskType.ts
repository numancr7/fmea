import mongoose, { Schema, model, models } from 'mongoose';
import { TaskType } from '@/types/models';

const taskTypeSchema = new Schema<TaskType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
});

const TaskTypeModel = models.TaskType || model<TaskType>('TaskType', taskTypeSchema);
export default TaskTypeModel; 